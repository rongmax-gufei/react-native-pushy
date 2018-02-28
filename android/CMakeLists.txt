# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

# Sets the minimum version of CMake required to build the native library.

cmake_minimum_required(VERSION 3.4.1)

set(APP_NAME rnupdate)
project (${APP_NAME})

# Creates and names a library, sets it as either STATIC
# or SHARED, and provides the relative paths to its source code.
# You can define multiple libraries, and CMake builds them for you.
# Gradle automatically packages shared libraries with your APK.

set(UPDATE_SRC
      src/main/cpp/DownloadTask.c
      src/main/cpp/blocksort.c
      src/main/cpp/bspatch.c
      src/main/cpp/bzlib.c
      src/main/cpp/crctable.c
      src/main/cpp/compress.c
      src/main/cpp/decompress.c
      src/main/cpp/huffman.c
      src/main/cpp/randtable.c
)

set(UPDATE_HEADERS
      src/main/cpp/bspatch.h
      src/main/cpp/bzlib.h
      src/main/cpp/bzlib_private.h
      src/main/cpp/cn_reactnative_modules_update_DownloadTask.h
)

add_library(
      # Sets the name of the library.
      ${APP_NAME}
      # Sets the library as a shared library.
      SHARED
      # Provides a relative path to your source file(s).
      ${UPDATE_HEADERS} ${UPDATE_SRC})

# Searches for a specified prebuilt library and stores the path as a
# variable. Because CMake includes system libraries in the search path by
# default, you only need to specify the name of the public NDK library
# you want to add. CMake verifies that the library exists before
# completing its build.

find_library(
      # Sets the name of the path variable.
      log-lib
      # Specifies the name of the NDK library that
      # you want CMake to locate.
      log)

# Specifies libraries CMake should link to your target library. You
# can link multiple libraries, such as libraries you define in this
# build script, prebuilt third-party libraries, or system libraries.

target_link_libraries(
      # Specifies the target library.
      ${APP_NAME}
      # Links the target library to the log library
      # included in the NDK.
      ${log-lib})