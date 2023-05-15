# Part1. Vue 시작하기
# ch01-01. Vue 개요 - 인사말
## 1. 공식문서  
https://vuejs.org  
https://v2.ko.vuejs.org/v2/guide/


# ch01-02. NodeJS 설치
## 참고 문서
https://heropy.blog/2018/02/17/node-js-install/
## 1. 처음 시작하는 Node.js 개발 - 설치 및 버전(NVM, n)
## 2. 공식 사이트
https://nodejs.org/en
> 설치는 짝수 버전, 홀수는 최신 버전에서 실험하는 버전
>> node -v, npm -v
- cf node: v12.22.12, npm: 6.14.18
> (nvm)node: v12.22.12, npm: 6.14.16
## 3. 직접설치, 패키지설치(homebrew)
## 4. 버전관리 - NVM, n
### NVM
Node를 설치하기 전에 설정하고 버전을 자유롭게 이동하기 쉽다  
충돌을 피하기 위해 NVM(Node Version Manager)을 설치하기 전 기존에 설치한 버전의 Node.js는 제거하는 것이 좋습니다  
NVM(Node Version Manager)을 설치하거나 업데이트하려면 cURL로 설치 스크립트를 사용할 수 있습니다  
설치가 되면 ~/.bash_profile, ~/.zshrc, ~/.profile 등의 프로파일에 nvm.sh이 실행되도록 다음 스크립트가 추가됩니다.
```
# 설치
brew install nvm
nvm install <version> 
> 버전은 공식 사이트 버전 확인(https://nodejs.org/ko/download/releases)
# 설치된 Node 버전 확인
nvm ls
# 사용할 Node 설정
nvm use <alias>/<version>
# 사용할 alias 설정
nvm alias <alias> <version>
```
### N
Node를 직접 제거하지 않기 때문에 Node를 미리 설치하였을때 관리하기 쉽다


# ch01-03. Vue 기본 설치
## 1. vue.js 다운로드
## 2. index.html
### 직접`<script>`에 추가
```
<head>
    <script src="vue.js"></script>
</head>
<body>
     <div id="app">
        {{msg}}
    </div>
    <script>
        new Vue({
            el: '#app', //element
            data: {
                msg: 'Hello Vue!!'
            }
        })
    </script>
</body>
```
> new Vue({el: '#app', data: {}}), element, data  
element: #app에 Vue 개념을 쓰겠다
### CDN
```
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```


# ch01-04. 웹 에디터 - Codepen, JSFiddle, JSBin
## 1. Codepen
HTML 직접 사용, JS에 외부 CDN 불러오기
- JS Opt: CDN, new Vue({});
- HTML: <div id="app"> ~ </div>
## 2.JSFiddle 3.JSBin



# ch02-01. Vue 시작하기 - 01. 선언적 렌더링
## 1. 선언적 렌더링
Vue.js의 핵심은 간단한 템플릿 구문을 사용해 선언적으로 DOM에 데이터를 렌더링하는 것입니다.
```
<div id="app">
	{{ message }}
</div>
```
```
var app new Vue({
	el: '#app',
	data: {
		message: '안녕하세요 Vue!'
	}
})
```
문자열 템플릿을 렌더링하는 것과 매우 유사하지만, 데이터와 DOM이 연결되어 이제 모든 것이 `반응형` 입니다.
- 텍스트 보간 이외에도 다른 엘리먼트 속성을 바인딩
```
<div id="app-2>
	<span v-bind:title="message>
		내 위에 잠시 마우스를 올리면 동적으로 바인딩 된 title을 볼 수 있습니다.
	</span>
</div>
```
> `v-bind`: 속성은 `디렉티브`라고 한다. 디렉티브는 Vue에서 제공하는 특수 속성임을 나타내는 v- 접두어 붙어있으며 DOM에 특수한 `반응형 동작`을 합니다.
```
var app2 = new Vue({
	el: '#app-2',
	data: {
		message: '이 페이지는 ' + new Date() + '에 로드 되었습니다'
	}
})
```
## 2.  예제
- HTML
```
    <div id="app">
      <div class="text" v-bind:class="{ 'active': active}">
        {{ message}}
      </div>
    </div>
```
- CSS
```
.text {
  font-size: 70px; 
}
.text.active {
  color: red;
}
```
- JS
```
const vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    active: true
  }
})
```
> v-bind:class="{ 'active': active}": active 클래스 추가 data = active 값에 따라서 결정


# ch02-02 Vue 시작하기 - 조건문과 반복문
## v-if
화면에서 렌더링 할 것인지 
```
<div id="app-3">
	<p v-if="seen">이제는 나를 볼 수 있어요</p>
</div>
```
> app.seen=false 입력 시 메세지가 사라짐  
이 예제는 테긋트와 속성뿐 아니라 DOM의 구조에도 데이터를 바인딩 할 수 있음을 보여줌 또한, Vue엘리먼트가 Vue에 삽입/갱신/제거될 때 자동으로 `트랜지션` 효과를 적용할 수 있다 (트랜지션: 나중에 설명 애니메이션이라 읽으면 됨)

- v-if="message"
> 빈 문자 데이터는 false, 0: false, 1: true

## v-for
```
<div id="app-4">
	<ol>
		<li v-for="todo in todos">
			{{ todo.text}}
		</li>
	</ol>
```
```
var app4 = new Vue({
	el: '#app-4',
	data: {
		todos: [
			{text: 'JavaScript 배우기' },
			{text: 'Vue 배우기' },
			{text: '무언가 멋진 것을 만들기' }
		]
	}
})
```
- v-for 주의 사항
> v-bind:key="item.id" 같은 고유 값을 필수로 넣어주어야 한다 



# ch02-03. Vue 시작하기 - 사용자 입력 핸들링
## v-on, v-on:click="<func>"
```
<div id="app-5>
	<p>{{ message }}</p>
	<button v-on:click="reverseMessage">메세지 뒤집기</button>
</div>
```
```
var app5 = new Vue({
	el: '#app-5',
	data: {
		message: '안녕하세요! Vue.js!'
	},
	methods: {
		reverseMessage: function () {
			this.message = this.message.split('').reverse().join('')
		}
	}
})
```
> v-on:click="<함수>" 클릭하면 함수를 실행시키겠다  
this는 Vue Instance, this.message > message  
message 반응형(성), 단방향
## v-model
양식에 대한 입력과 앱 상태를 양방향으로 바인딩하는 v-model 디렉티브를 제공
```
<div id="app-6">
	<p>{{ message }}</p>
	<input v-model="message">
</div>
```
```
var app6 = new Vue({
	el: 'app-6',
	data: {
		message: '안녕하세요 Vue!'
	}
})
```

# ch02-04. Vue 시작하기 - 컴포넌트를 사용한 작성방법 - 1
## 컴포넌틀르 사용한 작성방법
컴포넌트 시스템은 Vue의 또 다른 중요한 개념입니다: 부분의 개념, 재사용, 모든 응용 프로그램 인터페이스를 컴포넌트 트리로 추상화
```
Vue.component('todo-item', {
	template: '<li>할일 항목 하나입니다.<li>'
})

var app = new Vue(...)
```
```
<ol>
	<todo-tiem></todo-item>
</ol>
```
- 부모 영역의 데이터를 자식 컴포넌트에 집어넣을 수 있는 기능, prop
```
Vue.component('todo-item', {
	props: ['todo'], //properties
	template: '<li>{{ todo.text}}<li>'
})

var app = new Vue(...)
```
```
<div id="app-7">
	<ol>
		<todo-item
			v-for="item in groceryList">
			v-bind:todo="item"
			v-bind:key="item.id">
		</todo-item>
	</ol>
</div>
````
> 컴포넌트 태그는 보통 '-'이 붙는다 ex) app-nav
```

##  ch02-05. Vue 시작하기 - 컴포넌트를 사용한 작성방법 - 2
### HTML
```
<div id="app">
  <ul>
    <my-todo-item v-for="todo in todos"
                  v-bind:key="todo.id"
                  v-bind:todo="todo"></my-todo-item>
  </ul>
  <ul>
    <my-todo-item v-for="todo in todos2"
                  v-bind:key="todo.id"
                  v-bind:todo="todo"></my-todo-item>
  </ul>
</div>
```
### CSS
```
li span.done {
  text-decoration: line-through;
}
```
### JS
```
Vue.component('my-todo-item', {
  props: ['todo'],
  template: `<li>
      <input type="checkbox"
             v-model="todo.done">
       <span v-bind:class="{ done: todo.done }">{{ todo.title }}</span>
    </li>`
})

new Vue({
  el: '#app',
  data: {
    todos: [
      {
        id: '1',
        title: '아침 먹기',
        done: true
      },
      {
        id: '2',
        title: '점심 먹기',
        done: false
      },
      {
        id: '3',
        title: '저녁 먹기',
        done: true
      },
      {
        id: '4',
        title: '간식 먹기',
        done: false
      },
      {
        id: '5',
        title: '야식 먹기',
        done: false
      },
    ],
    todos2: [
      {
        id: '6',
        title: '잠자기',
        done: true
      },
    ]
  }
})
```
