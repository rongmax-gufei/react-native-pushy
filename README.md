# react-native-gufei-pushy

[![npm version](https://badge.fury.io/js/react-native-gufei-pushy.svg)](https://badge.fury.io/js/react-native-gufei-pushy)
[![npm](https://img.shields.io/npm/dt/react-native-gufei-pushy.svg)](https://www.npmjs.com/package/react-native-gufei-pushy)
![Platform - Android and iOS](https://img.shields.io/badge/platform-Android%20%7C%20iOS-yellow.svg)
![MIT](https://img.shields.io/dub/l/vibe-d.svg)

| Author        |     E-mail      |
| ------------- |:---------------:|
| gufei         | 799170694@qq.com|


## 功能介绍

- 本组件是面向React Native提供热更新功能的组件，建议结合[Update服务](http://update.reactnative.cn/)使用。
- 本组件解决了android studio3.0环境下的so包编译问题

## 安装使用

- 详细文档请访问 [react-native-pushy](https://github.com/reactnativecn/react-native-pushy)
- android studio3.0环境下的build配置如下：
1. 将android/src/main/jni目录改为android/src/main/cpp
2. 拷贝CMakeLists.txt到android目录下
3. 覆盖android/build.gradle文件
4. 点击AndroidStudio工具栏的build/Make Project，在android/build/intermediates/cmake自动生成对应的so文件 
