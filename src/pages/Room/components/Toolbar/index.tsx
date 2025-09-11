/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { memo } from 'react';
import AudioBtn from './AudioBtn';
import CameraCheckBtn from './CameraCheckBtn';
import style from './index.module.scss';
import SettingBtn from './SettingBtn';

function ToolBar() {

  return (
    <div className={style.roomToolBar} >
      <CameraCheckBtn />
      <AudioBtn />
      <SettingBtn />
    </div>
  );
}
export default memo(ToolBar);
