# Part3 LocalDB를 활용한 Todo list 만들기 (1)
# ch04-01. vue-Loader 소개
## vue component
전역등록, 지역등록
> 전역등록보단 지역등록을 실무에서 많이 사용
## 지역등록
template이란 속성안에서 String으로 작성하기에는 관리하기 어렵다(하이라이팅 처리 등)
> 파일로 관리하는 방법 제공

## Vue Loader
template 속성을 파일로 관리하는 방법
### Vue Loader는 무엇인가요
다음과 같이 작성된 Vue컴포넌트를 자바스크립트 모듈로 변환할 수 있는 webpack에서 사용하는 로더
### webpack이 무엇인가요?
모듈의 묶음, 각 파일을 모듈로 간주(프로젝트 구조)하고 파일 간 종속성을 파악한 다음 정적 Asset(결과물)로 묶어서 배포
### Vue 컴포넌트 스팩
*.vue 파일: html과 같은 문법을 사용하여 컴포넌트 작성
- 3가지 유형의 최상위 language block
> template, script, style
- desc
> vue-loader는 파일을 파싱하고 각 language block을 추출하며 필요한 경우 다른 로더를 통해 파이프 처리한 후 마지막으로 Module.exports가 Vue.js 컴포넌트 엘리먼트 옵션 객체인 CommonJS 모듈로 다시 조합합니다
### Language block
- template
> 내용이 문제열로 추출, 최대 하나의 template 가짐
- script
> js(ES2015는 babel-loader 또는 bubble-loader가 감지되면 자동으로 지원)  
최대 하나의 script 블록  
스크립트는 CommonJS와 같은 환경에서 실행, 다른 의존성을 require()할 수 있다. 또한 ES2015를 지원하여 `import와 export`를 사용할 수 있다
- style
> css  
한개의 *.vue에서 여러개의 style 태그를 지원  
scoped 또는 module 속성을 가질 수 있다 (캡슐화)  
기본적으로 내용이 추출되어 style-loader를 사용해 실제로 <style> 태그로 문서의 <head>에 동적으로 삽입됩니다.


# ch04-02. Todo 예제 소개
https://github.com/HeropCode/Vue-Todo-app [완성본]
- Vue Todo list app
> Vue CLI를 사용하지 않음으로 Vue 기반 프로젝트가 기본적으로 어떻게 동작하는지 이해(Vue CLI 기본적으로 셋팅되어 있는것)


# ch04-03. 프로젝트 생성
## Chapter1
### npm install
```
npm init
```
#### 의존성 모듈 설치
```
$ npm install --save MODULE_NAME
# or
$ npm i MODULE_NAME
```
#### 개발용 의존성 모듈 설치
패키지의 개발 시 사용될 의존성 모듈을 지정합니다.(배포 시 포함되지 않습니다)
```
$ npm install --save-dev MODULE_NAME
# or
$ npm i -D MODULE_NAME
```
### 한 번에 설치하기
```
$ npm i vue@^2 @babel/polyfill
```
```
$ npm i -D webpack webpack-cli webpack-dev-server webpack-merge @babel/core @babel/preset-env babel-loader vue-template-compiler vue-loader vue-style-loader css-loader node-sass sass-loader@^7 eslint@^5 babel-eslint eslint-config-standard@^12 eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard eslint-plugin-vue html-webpack-plugin copy-webpack-plugin clean-webpack-plugin postcss-loader autoprefixer
```

### Webpack
webpack은 웹팩(Webpack)의 핵심 패키지이며,  
webpack-cli는 터미널에서 웹팩 명령(Commands)를 실행할 수 있게 해주는 도구입니다.
```
$ npm i -D webpack webpack-cli
# or
$ npm i -D webpack@4.41.2 webpack-cli@3.3.10
```
개발용으로 실시간 Reload 서버를 실행하기 위해 webpack-dev-server를 설치합니다.
```
$ npm i -D webpack-dev-server
```
webpack-merge는 웹팩 Config 객체를 병합(merge)하기 위해 설치합니다.  
웹팩을 개발용(dev)과 배포용(build)으로 구분해 실행할 수 있습니다.

webpack.config.js 파일을 생성합니다.  
자세한 설정 내용은 완성된 파일(webpack.config.js)을 참고하세요.
```
package.json
"scripts": {
    "build": "webpack --mode production",    
    "test": "echo \"Error: no test specified\" && exit 1"
}
```
> npm run build

# ch04-04. Webpack 설치 및 기본설정(entry, output)
```
$ npm i -D webpack webpack-cli
```
## webpack.config.js 파일 생성
nodejs환경에서 돌아가는 webpack 설정파일
- webpack.config.js
```
// nodeJS
const path = require('path')

module.exports = {
    // 진입점
    entry: '',
    output: '',
    module: {},
    plugins: []
}
```
### entry
어디로 진입해야 하는지  
가장 먼저 실행될 파일, 그 외 기타 모듈들이 webpack 모듈로 들어가 bundle
```
entry: {
    app: path.join(__dirname, 'main.js')
},
```
NodeJS 환경, __dirname 현재 경로
### output
```
// 결과물에 대한 설정
output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist') // 디렉토리 ./dist/app.js
},
```
### webpack 실행
```
webpack --mode production
# or
npx webpack --mode production
# or
## 전역 설치
$ npm install -g webpack webpack-cli
## 동작
$ webpack --mode production
```


# ch04-05. vue-loader 설치 및 기본 설정(module, plugins)
```
npm install -D vue-loader vue-template-compiler
# or
npm install -D vue-loader@15.7.2 vue-template-compiler@2.6.10
```
entry, output 사이 webpack에 module과 plugins
- webpack.config.js
```
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    ..., 
    module: {
        rules: [
            // ... other rules
            {
              test: /\.vue$/,
              loader: 'vue-loader'
            }
          ]
    },
    plugins: [
		new VueLoaderPlugin()
	]
}
```


# ch04-06. Vetur 확장 프로그램(For VSCode) 설치
## App.vue
```
<template>
    <h1>{{ msg }}</h1>
</template>
<script>
export default {
    data () {
        return {
            msg: 'Hello Vue!'
        }
    }
}
</script>
<style scoped>
h1 {
    color: red;
}
</style>
```


# ch04-07. Vue 설치 및 최상위 컴포넌트(App.vue) 설정
```
npm i vue
# or
npm i vue@2.6.10
```
- main.js
```
import Vue from 'vue'
import App from './App.vue'

new Vue({
    el: '#app',
    // render (createElement) {
    //     return createElement(App)
    // },
    render: h => h(App)
})
```

# ch04-08. 기타 Loader 설치
```
npm i -D babel-loader vue-style-loader css-loader
# or
npm i -D babel-loader@8.0.6 vue-style-loader@4.1.2 css-loader@3.2.1
```
- webpack.config.js
```
module: {
    rules: [
        // ... other rules
        {
            test: /\.vue$/,
            use: 'vue-loader'
        },
        // this will apply to both plain `.js` files
        // AND `<script>` blocks in `.vue` files
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        },
        // this will apply to both plain `.css` files
        // AND `<style>` blocks in `.vue` files
        {
            test: /\.css$/,
            use: [
            'vue-style-loader',
            'css-loader'
            ]
        }
        ]
},
```
> vue-loader, babel-loader, vue-style-loader 설치 및 설정  
loader > use (최신버전 스타일)


# ch04-09. Babel 설치 및 설정(.babelrc) 그리고 @babel_polyfill
## Babel
ES6 이상의 코드를 ES5 이하 버전으로 변환하기 위해서 사용합니다.
- @babel/core: 바벨이 실제 동작하는 모듈
- @babel/preset-env: 바벨의 지원 스펙을 지정
- babel-loader: webpack 지원을 위해 사용
```
$ npm i -D @babel/core @babel/preset-env babel-loader
# or
$ npm i -D @babel/core@7.7.5 @babel/preset-env@7.7.6
```
.babelrc 파일을 생성하고 다음 옵션을 추가
```
{
  "presets": ["@babel/preset-env"]
}
```
@babel/polyfill을 의존성 모듈로 설치(개발X > 전체, --save-dev가 없어야 함)  
구형 및 일부 브라우저에서 지원하지 않는 기능들을 지원하기 위함  
무겁다, 설치 고려
```
$ npm i @babel/polyfill
# or
$ npm i @babel/polyfill@7.7.0
```
설치 후 webpack.config.js 설정
```
// ...
require('@babel/polyfill')

const config = {
  // ...
  entry: {
    app: [
      '@babel/polyfill',
      path.join(__dirname, 'main.js')
    ]
  }
  // ...
}
```


# ch04-10. HTML 설정
- dist/index.html
> index.html 새로 생성해야 되는 문제, dist dir 언제든지 삭제할 수 있게
- /index.html
> dist 폴더를 만들때 index.html 연결하기
>> html webpack plugins
- html webpack plugin
```
$ npm i -D html-webpack-plugin
# or
$ npm i -D html-webpack-plugin@3.2.0
```
- webpack.config.js 설정 (html-webpack-plugin)
```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html')
        })
    ]
}
```


# ch04-11. Favicon 설정 
- /assets/favicon.ico, favicon.png
- copy-webpack-plugin
```
$ npm i -D copy-webpack-plugin
# or
$ npm i -D copy-webpack-plugin@5.1.1
```
favicon 파일을 복사해서 배포용으로 삽입하기 위함
- webpack.config.js
```
const CopyPlugin = require('copy-webpack-plugin')

    plugins: [
		new CopyPlugin([
			{
				from: 'assets/',
				to: ''
			}
		])
	]
```
- index.html


# ch04-12. 빌드 충돌 최소화를 위한 clean-webpack-plugin 설정
새로 빌드할 때 기존 빌드폴더 삭제후 새로 배포하기 위한 plugin
```
$ npm i -D clean-webpack-plugin
# or
$ npm i -D clean-webpack-plugin@3.0.0
```
- webpack-config.js
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //es6 distructoring

plugins: [
		new CleanWebpackPlugin()
]
``` 
기본 옵션이 dist 폴더를 삭제하고 빌드


# ch04-13. 개발용 실시간 Reload 서버 설정 - webpack-dev-server
개발시 최대한 빠르게 수정사항을 테스트하기 위한 빌드 자동화
- install
```
$ npm i -D webpack-dev-server
# or
$ npm i -D webpack-dev-server@3.10.1
```
- 실행
```
$ webpack-dev-server --mode development
```
- package.json
```
"scripts": {
    "dev": "webpack-dev-server --mode development",
    "build": "webpack --mode production"
},
```
- webpack.config.js
```
devServer: {
    open: false,
    hot: true
}
```
- open: 브라우저가 바로 열림, 브라우저로 강제로 이동(default: true)  
- hot(hot module replacement(hmr)): 수정사항 바로 반영여부 (default: true)
- webpack.config.js - other 
```
devtool: 'eval'
```
> eval: 디버깅 가능하게 빌드하며 빠르게 빌드, 용량이 크고 최적화가 안되있음  
devltool: 'cheap-module-source-map', 용량이 적어지고 최적화가 잘됨, 디버깅 안되고 빌드가 길어짐
>> 개발용, 제품용 모듈 설정하는 방법?


# ch04-14. webpack 개발용과 제품용 분기 설정
webpack-merge
```
$ npm i -D webpack-merge
# or
$ npm i -D webpack-merge@4.2.2
```
- webpack.config.js
```
module.exports = (env, opts) => {
	const config = {
		// 개발, 제품용 중복되는 옵션
		... d
	}

	// 개발용
	if(opts.mode == 'development') {
		return merge(config, {
			// 추가 개발용 옵션
			devtool: 'eval',
			devServer: {
				open: false,
				hot: true
			}
		})
	// 제품용
	} else {
		// if(opts.mode == 'production') {	}
		return merge(config, {
			// 추가 제품용 옵션
			devtool: 'cheap-module-source-map',
			plugins: [
				new CleanWebpackPlugin()
			]
		})
	}
}
```
- module.exports = (env, opts) => { ... }  
- return merge(config, { //config2 ... })


# ch04-15. CSS 전처리(Preproces_SCSS)와 후처리(PostCSS_Autoprefixer) 모듈
## 전처리 - CSS - 후처리
전처리(LESS, SASS(SCSS 포함), Stylus) > Preprocessor
> SASS 설치
## 후처리 - PostCSS
Autoprefixer, 공급 업체 접두사(chrome, firefox, IE, ...)
> webkit-, ms-, moz-, o-
## SASS 설치
```
$ npm i -D sass-loader@^7 node-sass
# or
$ npm i -D sass-loader@^7.3.1 node-sass@4.13.0
```
^ 캐럿기호로 해당 버전의 가장 최신버전을 설치할 수 있다, sass가 scss도 처리해준다
- webpack.config.js
```
module: {
    rules: [
        // ... other rules
        {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
            ]
        }
        ]
},
```
- App.vue
```
<style scoped lang="scss">
$color: blue;

h1 {
    color: $color;
}
</style>
```
## 후처리기 설치 - autoprefixer, postcss-loader
```
$ npm i -D autoprefixer postcss-loader
# or
$ npm i -D autoprefixer@9.7.3 postcss-loader@3.0.0
```
autoprefixer는 postcss-loader에 종속적
- postcss.confg.js
```
module.exports = {
    plugns: [
        require('autoprefixer')
    ]
}
```
- webpack.config.js
```
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'postcss-loader'
            ]
        },
        {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]
        }
    ]
}
```
> 순서 중요 postcss > sass
- package.json
```
"browersList": [
    "last 2 versions",
    "ie >= 10"
],
```
- App.vue
```
<style scoped lang="scss">
$color: blue;

h1 {
    color: $color;
    display: flex;
}
</style>
```
> display: flex; 브라우저 prefixer 붙여주는 기능


# ch04-16. 가져오기(import)확장자 생략, gitignore 설정 등
## 가져오기 확장자 생략
- main.js
```
import Vue from 'vue'
import App from './App'
```
'App.vue' > './App'
- webpack.config.js
```
resolve: {
    extensions: ['.vue', '.js']
},
```
## 경고 메세지 - description, repository
- package.json
```
"description": "Vue Todo App",
"repository": {
    "type": "git",
    "url": "https://github.com"
},
```
## .gitignore


# ch04-17. ESLint 설치 및 설정
## ESLint
'ESLint'는 코드 품질과 코딩 스타일 문제를 식별하기 위한 정적 코드 분석 도구입니다.  
eslint는 6버전의 호환성 모듈(Peer Dependency) 이슈로 5버전을 설치합니다.
```
$ npm i -D eslint@^5 babel-eslint eslint-config-standard@^12 eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard eslint-plugin-vue
# or
$ npm i -D eslint@^5 babel-eslint@^10 eslint-config-standard@^12 eslint-plugin-import@^2 eslint-plugin-node@^10 eslint-plugin-promise@^4 eslint-plugin-standard@^4 eslint-plugin-vue@^5
```
- eslint
- babel-eslint: 문법 분석 모듈
- eslint-config-standard: 자바스크립트 표준 스타일 구성파일
- eslint-plugin-import
- eslint-plugin-~
### .eslintrc.js 설정
```
module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2015,
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    extends: [
        'standard',
        'plugin:vue/essential'
    ],
    plugins: [
        'vue'
    ],
    rules: {
        // 예외 규칙들
        'no-new': 0
    }
}
```
> `extends`, 예외 규칙
### .eslintignore
```
node_modules/
dist/
assets/
```
### 검사
```
"scripts": {
    "lint": "eslint --ext .js,.vue .", // 검사
    "lint:fix": "eslint --fix --ext .js,.vue ." // 수정
},
```
npm run lint/lint:fix
> 스페이스바는 직접 수정해주어야함