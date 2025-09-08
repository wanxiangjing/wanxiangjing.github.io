import type { SafeAny } from "../../types/Safe";

export type ApiAbortError = 'Timeout' | 'Reset AI Evaluation' | 'Click Stop';

export const ApiAbortError = {
    TIMEOUT: 'Timeout' as ApiAbortError,
    RESET_AI_EVALUATION: 'Reset AI Evaluation' as ApiAbortError,
    CLICK_STOP: 'Click Stop' as ApiAbortError
};

interface DoubaoContextOptions {
    systemMessage?: string;
    contextId?: string;
    ttl?: number;
}

export interface IChatResult {
    content: string;
    isEnd: boolean;
    id: string;
    model: string;
    object?: string;
    created: number;
    role?: string;
}

const aiBaseUrl = 'https://opencamp.cn/api/ai/doubao/context';

function jsonParse<T>(str: string): T | false {
    try {
        return JSON.parse(str as string) as T
    } catch (error: SafeAny) {
        console.error('Error parsing JSON:', error);
        return false;
    }
}

class DoubaoContext {
    private contextId: string = '';

    private isInit: boolean = false;

    private initCallbacks: Array<(contextId: string) => void> = [];

    constructor(options: DoubaoContextOptions = {}) {
        const { systemMessage, contextId, ttl } = options;
        if (contextId) {
            this.isInit = true;
            this.contextId = contextId;
        } else {
            this.initContextId(systemMessage || '你是一位技术开发学习训练营的小助手', ttl);
        }
    }

    onInit(callback: (contextId: string) => void) {
        this.initCallbacks.push(callback);
    }

    // 初始化 contextId
    initContextId(systemMessage: string, ttl?: number) {
        if (this.isInit) return;
        fetch(`${aiBaseUrl}/contextId`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') || '' },
            body: JSON.stringify({ systemMessage, ttl }),
        }).then(res => {
            res.json().then(data => {
                this.contextId = data.id;
                this.isInit = true;
                this.initCallbacks.forEach(callback => callback(this.contextId));
            })
        }).catch((error) => {
            console.error('Error initializing context:', error);
        })
    }

    // 获取 contextId
    async getContextId() {
        if (this.isInit)
            return this.contextId;
    }

    // 发送消息
    async sendMessage({
        messages,
        onProgress,
        onEnd,
        onFail,
        cancelToken,
        timeout = 30000
    }: {
        messages: Array<{ role: string, content: string }>,
        onProgress?: (progress: IChatResult) => void,
        onEnd?: (res: IChatResult) => void,
        onFail?: (error: SafeAny) => void,
        cancelToken?: AbortController
        timeout?: number
    }
    ) {
        if (this.isInit) {
            try {
                // 设置fetch超时处理
                const timeoutId = setTimeout(() => cancelToken?.abort(ApiAbortError.TIMEOUT), timeout);
                let fullText = ''
                const response = await fetch(`${aiBaseUrl}/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') || '' },
                    body: JSON.stringify({ contextId: this.contextId, messages }),
                    signal: cancelToken?.signal,
                });
                clearTimeout(timeoutId);
                // console.log('接口已相应,清除定时器');
                // 2. 检查响应状态（HTTP 错误如 404/500）
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // 3. 检查流支持
                if (!response.body) {
                    throw new Error('Streaming not supported by server');
                }
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    // eslint-disable-next-line no-await-in-loop
                    const { done, value } = await reader.read();
                    if (done) {
                        break
                    };
                    const chunk = decoder.decode(value);
                    fullText += chunk;
                    const data = this.parseChatResponse(chunk)
                    onProgress?.(data);
                    if (data.isEnd) {
                        onEnd?.(this.parseChatResponse(fullText));
                        break
                    }
                }
            } catch (error) {
                console.error('Error sending message:', error);
                onFail?.(cancelToken?.signal.reason || '');
            }
        } else {
            this.onInit(() => {
                this.sendMessage({ messages, onProgress, cancelToken, onEnd, timeout });
            });
        }
    }

    getIsInit() {
        return this.isInit;
    }

    cutFromFirstBrace = (str: string) => {
        const index = str.indexOf('{');
        return index !== -1 ? str.substring(index) : str;
    };


    // 统一处理接口返回的内容，传给回调
    parseChatResponse(chunk: string) {
        const strArr = chunk.split('\n\n').filter((str) => str !== 'data: [DONE]' && !!str);
        const objArr = strArr.map((str) => {
            return jsonParse<SafeAny>(`${this.cutFromFirstBrace(str)}`);
        });
        const data = { ...objArr[0], content: '', isEnd: false }
        delete data.choices
        objArr.forEach((obj) => {
            if (obj && obj.choices && obj.choices.length > 0) {
                data.content += obj.choices[0].delta.content || '';
                if (obj.choices[0].finish_reason) {
                    data.isEnd = true;
                }
            }
        })
        return data as IChatResult
    }
}

export default DoubaoContext;
