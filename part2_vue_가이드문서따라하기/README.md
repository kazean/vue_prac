# Part2. Vue 가이드 문서 따라하기
# ch03-01. Vue 가이드 - Vue 인스턴스
## 예제1
## 데이터와 메소드, 인스턴스 속성
'$' > vue에서 기본적으로 사용하는 속성들  
vm.$refs
- 반응성
> Vue 인스턴스가 생성될때 정의되지 않은 데이터는 반응성을 가지지 않는다.
### 인스턴스 주의사항 - 반응성
- 기존의 데이터를 정의하지 않았지만, this를 참조하여 인스턴스 내부에 변수를 넣어주는 경우
> 인스턴스에 해당 변수가 없었기 때문에 이런 데이터는 반응성을 가지지 않는다
>> msgB: null or ''으로 정의해야 한다.
### computed
계산된 데이터, 기존에 데이터를 추가적으로 계산을 해서 랜더링
### watch
데이터가 변경될때마다 해당 함수를 실행
### created, mounted
life cycle hook


# ch03-02. 라이프사이클 - 1
## 인스턴스 라이프사이클 훅
### 라이프사이클, 다이어그램
- new Vue() > beforeCreate > created > beforeMount > mounted > beforeUpdate/updated > beforeDestroy > destroyed
- mounted
> el 요소를 이때 연결되어 사용할 수 있다


# ch03-03. 라이프사이클 - 2
## 예제
- 주의! beforeUpdate, updated
> watch와 같이 사용하면 문제가 발생할 수 있다


# ch03-04. 템플릿 문법
## 보간법
### 문자열, v-once
데이터를 한 번만 랜더링하고 반응성은 사용하지 않는다, 메모리 확보, 많이 사용하지 않음
### 원시 HTML, v-html
실제 HTML 출력
### Javascript 표현식 사용
문자 보간법 내부에서 JS 표현식 사용할 수 있다
### 속성
- v-bind 디렉티브  
> 약어 v-bind:class > :class
- v-on:click
> @click


# ch03-05. computed
## computed 속성
템플릿내 표현식을 사용할 수 있지만, 간단한 연산일때만 사용하는 것이 좋다, 복잡한 로직이라면 computed 속성을 사용
```
<div id="example">
  <p>원본 메시지: "{{ message }}"</p>
  <p>역순으로 표시한 메시지: "{{ reversedMessage }}"</p>
</div>
```
```
var vm = new Vue({
  el: '#example',
  data: {
    message: '안녕하세요'
  },
  computed: {
    // 계산된 getter
    reversedMessage: function () {
      // `this` 는 vm 인스턴스를 가리킵니다.
      return this.message.split('').reverse().join('')
    }
  }
})
```
## JS 스프레드 문법
```
computed: {
        computedTodos () {
            return this.todos.map((todo, index) => {
                // return Object.assign({}, todo, {
                //     id: index + 1,
                //     done: false
                // })
                return { //JS 스프레드 문법
                    ...todo,
                    id: index + 1,
                    done: false
                }
            })
        }
    }
```

# ch03-06. computed 캐싱
## computed 속성
computed 속성 대신 메소드와 같은 함수를 정의할 수도 있습니다. 최종 결과에 대해 두 가지 접근 방식은 서로 동일합니다. 차이점은 `computed 속성은 종속 대상을 따라 저장(캐싱)된다는 것`  
또한 Date.now()처럼 아무 곳에도 의존하지 않는 computed 속성의 경우 절대로 업데이트되지 않는다는 뜻입니다  
이에 비해 메소드를 호출하면 렌더링을 다시 할 때마다 항상 함수를 실행합니다


# ch03-07. computed Getter,Setter
## computed 속성의 setter 함수
computed 속성은 기본적으로 getter 함수만 가지고 있지만, 필요한 경우 setter 함수를 만들어 쓸 수 있습니다.
```
const vm = new Vue({
	el: '#app',
	data: {
		msg: 'Hello Vue!'
	},
	computed: {
		// reversedMsg () {
		//     return this.msg.split('').reverse().join('')
		// }
		reversedMsg: {
			//Getter
			get () {
				return this.msg.split('').reverse().join('')
			},
			set (value) {
				this.msg = value
			}
			
		}
	}
})
```
> setter 호출시 getter 호출되서 랜더링되기에 역방향 문자열 출력


# ch03-08. watch
## watch 속성
대부분의 경우 computed 속성이 더 적합하지만 사용자가 만든 감시자가 필요한 경우가 있습니다. 그래서 Vue는 watch 옵션을 통해 데이터 변경에 반응하는 보다 일반적인 방법을 제공합니다  
이는 데이터 변경에 대한 응답으로 비동기식 또는 시간이 많이 소요되는 조작을 수행하려는 경우에 가장 유용합니다.
```
const vm = new Vue({
	el: '#app',
	data: {
		msg: 'Hello Vue!'
	},
	computed: {
		reversedMsg: {
			get () {
				return this.msg.split('').reverse().join('')
			},
			set (v) {
				this.msg = v
			}
		}
	},
	watch: {
		msg (newMsg) {
			console.log('New msg:' + newMsg)
		},
		reversedMsg (newMsg) {
			console.log('New reversedMsg:' + newMsg)
		}
	}
})
```
> msg에 대한 watch, reversedMsg에 대한 watch


# ch03-09. 클래스와 스타일 바인딩 - 1
## 클래스와 스타일 바인딩
데이터 바인딩은 엘리먼트의 클래스 목록과 인라인 스타일을 조작하기 위해 일반적으로 사용됩니다. 이 두 속성은 v-bind를 사용하여 처리할 수 있습니다. 우리는 표현식으로 최종 문자열을 계산하면 됩니다. 그러나 문자열 연결에 간섭하는 것은 짜증나는 일이며 오류가 발생하기 쉽습니다. 이러한 이유로, Vue는 class와 style에 v-bind를 사용할 때 특별히 향상된 기능을 제공합니다. 표현식은 문자열 이외에 객체 또는 배열을 이용할 수 있습니다.
## HTML 클래스 바인딩 하기
### 객체 구문
```
<div v-bind:class="{active : isActive}"></div>
```
> 위 구문은 active 클래스의 존재 여부가 데이터 속성 isActive 의 참 속성에 의해 결정되는 것을 의미합니다, { ~ }는 하나의 객체 데이터이다.  
- 객체에 필드가 더 있으면 여러 클래스를 토글 할 수 있습니다. 또한v-bind:class 디렉티브는 일반 class 속성과 공존할 수 있습니다. 그래서 다음과 같은 템플릿이 가능합니다
```
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
```
- 바인딩 된 객체는 인라인 일 필요는 없습니다.
```
<div v-bind:class="classObject"></div>

data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```
- 또한 객체를 반환하는 계산된 속성에도 바인딩 할 수 있습니다. 이것은 일반적이며 강력한 패턴입니다.
### 배열 구문
우리는 배열을 v-bind:class 에 전달하여 클래스 목록을 지정할 수 있습니다.
```
<div v-bind:class="[activeClass, errorClass]"></div>

data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```
- 삼항 연산자
```
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
>
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```
### 컴포넌트와 함께 사용하는 방법
사용자 정의 컴포넌트로 class 속성을 사용하면, 클래스가 컴포넌트의 루트 엘리먼트에 추가 됩니다. 이 엘리먼트는 기존 클래스는 덮어쓰지 않습니다.
```
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})

<my-component class="baz boo"></my-component>
>
<p class="foo bar baz boo">Hi</p>
```
> 클레스 바인딩도 동일


# ch03-10. 클래스와 스타일 바인딩 - 2
## 인라인 스타일 바인딩
### 객체 구문
v-bind:style 객체 구문은 매우 직설적입니다. 거의 CSS 처럼 보이지만 JavaScript 객체입니다. `속성 이름에 camelCase와 kebab-case (따옴표를 함께 사용해야 합니다)를 사용할 수 있습니다.`
```
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

data: {
  activeColor: 'red',
  fontSize: 30
}
```
> camel > kebab
- 스타일 객체에 직접 바인딩 하여 템플릿이 더 간결하도록 만드는 것이 좋습니다.
```
<div v-bind:style="styleObject"></div>

data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```
### 배열 구문
```
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```
> 배열로 사용할 수 있으며, 중복되는 속성은 덮어써진다
### 자동 접두사
v-bind:style 에 브라우저 벤더 접두어가 필요한 CSS 속성 (예: transform)을 사용하면 Vue는 자동으로 해당 접두어를 감지하여 스타일을 적용합니다
### 다중 값 제공
- 2.3.0+
```
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```
> 브라우저가 지원하는 배열의 마지막 값만 렌더링합니다. 이 예제에서는 flexbox의 접두어가 붙지않은 버전을 지원하는 브라우저에 대해 display : flex를 렌더링합니다.


# ch03-11. 조건부 렌더링 - v-if
## v-if, v-else, v-else-if
- v-if
> 디렉티브이기에 하나의 엘리먼트 이상 추가, 하나 이상의 엘리먼트를 트랜지션하려면 'template' 엘리먼트에 v-if 사용할 수 있다, 최종 결과엔 template 태그 포함되지 않음
- v-else
- v-else-if
> 2.1.0+ 부터 추가됨

## key를 이용한 재사용 가능한 엘리먼트 제어
key를 변경해도 사용자가 입력한 내용은 지워지지 않음


## ch03-12. 조건부 렌더링 - v-show
v-if와 차이점은 v-show가 있는 엘리먼트는 항상 렌더링 되고 DOM에 남아있다는 점입니다. v-show는 단순히 엘리먼트에 display CSS 속성을 토글합니다.
> v-if는 토글 비용이 높고, v-show는 초기 렌더링 비용이 더 높다. 자주 바뀐다면 v-show, 보통 v-if 권장


## ch03-13. 리스트 렌더링 - 배열(Array)
### v-for로 엘리먼트에 배열 매핑하기
```
<div id="app">
	<button @click="pushTodo">Push</button>
	<ul class="todos">
		<li v-for="(todo, index) in todos"
			:key="index">
			{{todo.title}}
		</li>
	</ul>
</di
```
> v-bind:key="index" 사용

### 배열 변경감지
Vue는 감시중인 배열의 변이 메소드를 래핑하여 뷰 갱신을 트리거합니다. 래핑된 메소드는 다음과 같습니다.
```
<div id="app">
	<button @click="pushTodo">Push</button>
	<ul class="todos">
		<li v-for="(todo, index) in todos"
			:key="index">
			{{todo.title}}
		</li>
	</ul>
</di
```
> push(), pop(), shift(), unshift(), splice(), sort(), reverse()


## ch03-14. 리스트 렌더링 - 객체(Object)
### 객체 변경 감지에 관한 주의사항
모던 JavaScript의 한계로 Vue는 속성 추가 및 삭제를 감지하지 못합니다.
> 그러나 Vue.set(object, propertyName, value) 메소드를 사용하여 중첩된 객체에 반응형 속성을 추가할 수 있습니다.
```
<ul class="heropy">
	<li v-for="(value, key, index) in heropy"
		:key="index">
		{{value}}
	</li>
</ul>

const vm = new Vue({
            el: '#app',
            data: {
                heropy: {
                    name: 'HEROPY',
                    age: 35
                }
            },
            methods: {
            }
        })
```
> 주의! 객체는 v-for="(value, key, index) in items" 순 
- 인스턴스 메소드인 vm.$set를 사용할 수도 있습니다. 이는 전역 Vue.set의 별칭입니다.
- 때로는 Object.assign()이나 _.extend()를 사용해 기존의 객체에 새 속성을 할당할 수 있습니다. 이 경우 두 객체의 속성을 사용해 새 객체를 만들어야 합니다.
```
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```


## ch03-15. 리스트 렌더링 - Vue.set, this.$set
### Vue.set
```
Vue.set(this.todos, 3, { title: '야식 먹기!' })
```
> Vue.set(object, propertyName, value)  
Vue.set(Array, index, value)  
= vue.$set(Array, index, value)  (= this.$set(~) )
>> Vue.set과 동일한 기능을 하는 vm.$set 메소드


## ch03-16. 이벤트 핸들링 - 메소드 이벤트 핸들러
### 메소드 이벤트 핸들러
- event
메소드 사용시 매개변수 없이 전달하면 메소드 인자로 event 객체가 넘어온다  
직접 매개변수를 통해 넘겨주려면 $event
- cf, event.currentTaget.className

### 인라인 메소드 핸들러
메소드 이름을 직접 바인딩 하는 대신에 인라인 JavaScript 구분 사용 가능
- @click="say('hi')"
- $event
> 때로 인라인 명령문 핸들러에서 원본 DOM 이벤트에 액세스 해야 할때 $event 변수 사용해 메소드에 전달가능
```
@click="clickMethod(todo.title, $event)

clickMethod(title, event) {
	~
}
```


## ch03-17. 이벤트 핸들링 - 이벤트 수식어
이벤트 핸들러 내부에 event.prevetnDefault() 또는 event.stopPropagation()를 호출하는 것은 매우 보편적인 일입니다  
메소드 내에서 이 작업을 쉽게 할 수 있지만, 데이터 로직만 처리하기 위해서 v-on 이벤트에 이벤트 수식어를 제공 합니다
- .stop .prevent .capture .self .once .passive
```
<!-- 클릭 이벤트 전파가 중단됩니다 -->
<a v-on:click.stop="doThis"></a>

<!-- 제출 이벤트가 페이지를 다시 로드 하지 않습니다 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 수식어는 체이닝 가능합니다 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 단순히 수식어만 사용할 수 있습니다 -->
<form v-on:submit.prevent></form>

<!-- 이벤트 리스너를 추가할 때 캡처모드를 사용합니다 -->
<!-- 즉, 내부 엘리먼트를 대상으로 하는 이벤트가 해당 엘리먼트에서 처리되기 전에 여기서 처리합니다. -->
<div v-on:click.capture="doThis">...</div>


<!-- event.target이 엘리먼트 자체인 경우에만 트리거를 처리합니다 -->
<!-- 자식 엘리먼트에서는 안됩니다 -->
<div v-on:click.self="doThat">...</div>
```
- cf, 수식어 순서지정
> 관련 코드가 동일한 순서로 생성되므로 수식어를 사용할 때 순서를 지정하세요  
다시말해 `v-on:click.prevent.self`를 사용하면 **모든 클릭**을 막을 수 있으며 `v-on:click.self.prevent`는 엘리먼트 자체에 대한 클릭만 방지합니다
- passive
```
<!-- 스크롤의 기본 이벤트를 취소할 수 없습니다. -->
<div v-on:scroll.passive="onScroll">...</div>
```
> 브라우저는 핸들러가 event.preventDefault()를 호출할지 알지 못하므로 프로세스가 완료된 후 스크롤 합니다. .passive 수식어는 이 이벤트가 기본 동작을 멈추지 않는다는 것을 브라우저에 알릴 수 있습니다.
- cf
> `.passive`와 `.prevent`를 함께 사용하지 마세요.`.prevent`는 무시되고 브라우저는 오류를 발생시킬 것입니다  
`.passive`는 당신이 이벤트의 기본 행동을 무시하지 _않기를 원하는_ 브라우저와 상호작용한다는 사실을 기억하세요.


## ch03-18. 이벤트 핸들링 - 키 수식어
이벤트의 키코드 대신에 Vue의 v-on 키 수식어
```
<input v-on:keyup.enter="submit">

<!-- 캐밥, 카멜  $event.key === 'PageDown', 브라우저마다 동적안할 수 있다 -->
<input v-on:keyup.page-down="onPageDown">
```

- 체이닝 가능
> @click.ctrl.enter: ctrl + enter
### Key Codes
```
.enter
.tab
.delete (“Delete” 와 “Backspace” 키 모두를 캡처합니다)
.esc
.space
.up
.down
.left
.right
```

### 2.1.+ 추가
```
.ctrl
.alt
.shift
.meta // cmd, window
```


## ch03-19. 폼 입력 바인딩 - v-model과 한글 사용
### 기본 사용법
v-model 양방향 사용
- cf
> `v-model`은 모든 form 엘리먼트의 초기 `value`와 `checked` 그리고 `selected` 속성을 무시합니다  
항상 Vue 인스턴스 데이터를 원본 소스로 취급합니다. 컴포넌트의 `data` 옵션 안에 있는 JavaScript에서 초기값을 선언해야합니다.
- v-model 의 경우, `한글`은 한글자가 완전히 완성되었을때 양방향인식 된다(엔터를 눌렀을 경우)
> `v-on:input="message = $event.target.value" :value="message"` 로 양방향 설정
### 체크박스, 라디오, 셀렉트박스


## ch03-20. 폼 입력 바인딩 - v-model 수식어
### Lazy
- v-on:change
> 포커스가 블러처리 되거나 엔터를 누를 경우에 바인딩, 양방향 아님
- @click과 같은 v-model `.lazy 수식어`
> v-model.lazy="message"

### trim
### number
만약 변환이 불가능한 경우 원래의 값이 입력된다


## ch03-21. 컴포넌트 - 컴포넌트란 무엇인가요?
컴포넌트는 뷰의 강력한 기능 중 하나 기본 `HTML 엘리먼트`를 `재사용 가능한 코드`를 `캡슐화`하는데 도움


## ch03-22. 컴포넌트 - 컴포넌트 사용하기 - 전역 등록과 지역 등록
### 전역 등록
```
Vue.component('my-component', {
	template: '<div class="me">{{ message }}</div>',
	data: function () {
		return {
			message: 'Hello Vue!'
		}
	}
})

<my-component />
```
- 데이터는 함수로 작성해야 한다.
- cf
> Vue는 사용자 지정 태그 이름에 대해 [W3C 규칙](http://www.w3.org/TR/custom-elements/#concepts)을 적용하지 않습니다 (모두 소문자이어야 하고 하이픈을 포함해야합니다). 그러나 이 규칙을 따르는 것이 좋습니다.

### 지역 등록
```
const myComp = {
	template: '<div class="me">{{ message }}</div>',
	data: function () {
		return {
			message: 'Hello Vue!'
		}
	}
}

const vm1 = new Vue({
	el: '#app1',
	components: {
		'my-component': myComp
	}
})

<div id="app1">
	<my-component />
</div>
``` ㅇ

- 캐밥 to 카멜
```
const vm2 = new Vue({
	el: '#app2',
	components: {
		myComp
	}
})

<div id="app2">
	<my-comp />
</div>
```
> myComp 를 my-comp 태그로 변경  
JS 최신 문법 'myComp': myComp > myComp


## ch03-23. 컴포넌트 - 컴포넌트 사용하기 - data 속성이 함수인 이유
primitive type 의 경우 다른 객체에 복사해도 값이 같이 바뀌지 않지만, 객체나 배열의 경우는 같은 데이터를 참조  
그렇기에 새로운 객체 데이터를 만들기 위해 함수로 data를 정의
```
data () {
	return {
		message: 'Hello vue!'
	}
}
```


## ch03-24. 컴포넌트 - 컴포넌트 사용하기 - 데이터 전달(props)
```
Vue.component('my-comp', {
	template: '<div>{{ msg }}</div>',
	props: ['msg']
})

const vm = new Vue({
	el: '#app',
	data () {
		return {
			message: 'Hello'
		}
	},
})

<div id="app">
	<my-comp :msg="message"></my-comp>
</div>
```
### camelCase vs.kebab-case
props에 camel을 html에 케밥으로 자동 변환해준다
### 동적 props
:msg="message"
### props 검증(validator), default, type
```
Vue.component('my-comp', {
	template: '<div>{{ myMsg }}</div>',
	props: {
		myMsg: {
			type: [String, Number],
			// default: 'Default!',
			required: true,
			validator (value) {
				return value === 'Hello'
			}
		}
	}
})
```
> props 객체 속성, required, default, validator(func)


## ch03-25. 사용자 지정 이벤트($emit)
### v-on 을 이용한 사용자 지정 이벤트
모든 Vue인터페이스는 다음과 같은 이벤트 인터페이스를 구현
```
$on(eventName)을 사용하여 이벤트를 감지 하십시오.
$emit(eventName)을 사용하여 이벤트를 트리거 하십시오
```
### $emit
자식에서 이벤트를 발생하여 부모 메소드를 실행
```
<div id="app">
	<my-comp :my-msg="message" @my-event="updateMessage"></my-comp>
</div>

Vue.component('my-comp', {
	template: '<div @click="updateMsg">{{ myMsg }}</div>',
	props: {
		myMsg: String
	},
	methods: {
		updateMsg() {
			// this.myMsg = 'Good'
			this.$emit('my-event', 'Good')
		}
	}
})

const vm = new Vue({
	el: '#app',
	data () {
		return {
			message: 'Hello'
		}
	},
	methods: {
		updateMessage (value) {
			this.message = value
		} 
	}
})
```
> @click > updateMsg() > this.$emit('my-event', 'Good') >  @my-event="updateMessage" >updateMessage()


## ch03-26. 컴포넌트 - Slot
### 단일 slot
- HTML에 있는 엘리먼트가 slot에 들어감
- 대체 메세지: 부모에서 아무것도 작성하지 않을 경우, 컴포넌트에 slot 태그 안에 작성된 요소가 랜더링됨
### 이림을 가지는 슬롯
```
<div id="app">
	<my-comp>
		<template slot="slot1">Hello Slot!</template>
	</my-comp>
</div>

Vue.component('my-comp', {
	template: '<div><slot name="slot1"></slot></div>',
	data () {
		return {
			message: 'Hello Slot'
		}
	}
})
const vm = new Vue({
	el: '#app'
})
```
> 부모 마크업 slot 속성, my-comp 컴포넌트 slot 태그의 name 속성

### 범위를 가지는 슬롯
범위가 지정된 슬롯은 이미 렌더링 된 엘리먼트 대신 재사용 가능한 템플릿(데이터를 전달할 수 있음)으로 작동하는 특별한 유형의 슬롯입니다.
```
<div id="app">
	<my-comp>
		<template slot-scope="{ mySlotData }">
			{{ mySlotData }}
		</template>
	</my-comp>
</div>

Vue.component('my-comp', {
	template: '<div><slot :my-slot-data="message"></slot></div>',
	data () {
		return {
			message: 'Hello Slot?'
		}
	}
})
const vm = new Vue({
	el: '#app'
})
```
> 위 처럼 작성할 수 있고 slot-scope="myProp", {{ myProp.mySlotData }} 처럼 사용할 수 있다