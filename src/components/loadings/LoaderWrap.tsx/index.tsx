
const styles: Record<string, React.CSSProperties> = {
    loaderWrap: {
        position: 'fixed',
        zIndex: 9999,
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        transition: 'all 0.3s ease-in-out',
    },
}

const LoaderWrap = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={styles.loaderWrap}>
            {children}
        </div>
    )
}

export default LoaderWrap;
