# Part9. Jest와 Vue Test Utils
# Ch05-01. Vue 단위 테스트 - 개요
## 단위 테스트(Unit test)
### Jest 설치
```
$ npm install -g jest
```
> 26.0.1 / 29.5.0
- 테스트를 위해 추가 모듈 설치 - Vue Test Utils
```
$ npm install -D jest @vue/test-utils vue-jest babel-jest babel-core@bridge
```

# Ch05-02. Vue CLI로 연습 환경 만들기
## jest-test project
```
$ vue create jest-test
```
> Manually > Babel, Vuex, CSS Preprocessor, Linter, Unit Test > SCSS (Node) > ESLint Standard Config > Lint on save(해제) > Jest > In dedicated config files > N
```
$ code .
```
> (안될시) vscode code command
- package.json
```
$ npm run test:unit
```
> tests/unit/example.spec.js

# Ch05-03. 첫 테스트 작성 - 1
## calc.js
```
function addOne (a) {
  return a + 1
}

export {
  addOne
}
```
> $node ./calc.js, 수동검사
## __tests__/calc.test.js
```
import { addOne } from "../calc";

test('첫 번째 테스트', () => {
  expect(2).toBe(2)
})
```
> $ jest  
export, import
test('<test-name>', anonymous func)  
expect(Received).toBe(expected value)

# Ch05-04. 첫 테스트 작성 - 2
## __tests__/calc.test.js
```
import { addOne } from "../calc";

test('인수가 숫자인 경우', () => {
  expect(addOne(2)).toBe(3)
})

test('인수가 문자인 경우', () => {
  expect(addOne('2')).toBe(3)
})
```
## calc.js
```
function addOne (a) {
  return parseInt(a, 10) + 1
}
```

# Ch05-05. Jest Globals
## Methods
- afterAll/Each(fn, timeout)
- beforeAll/Each(fn, timeout)
- describe(name, fn), ...
- test(name, fn, timeout), ...
> test 그룹화 한것 describe  
after, before > Hook, All은 모든 테스트 전/후 한번만 Each는 매번
## __tests__/calc.test.js
- 1
```
describe('addOne', () => {
  
  test('인수가 숫자인 경우', () => {
    expect(addOne(2)).toBe(3)
    expect(addOne(7)).toBe(8)
  })
  
  test('인수가 문자인 경우', () => {
    expect(addOne('2')).toBe(3)
    expect(addOne('77')).toBe(78)
  })
})
```
- 2
```
import { addOne } from "../calc";

describe('addOne', () => {
  beforeAll(() => {
    console.log('beforeAll')
  })
  afterAll(() => {
    console.log('afterAll')
  })
  beforeEach(() => {
    console.log('beforeEach')
  })
  afterEach(() => {
    console.log('afterEach')
  })

  test('1', () => {
    console.log('test 1')
  })

  test('2', () => {
    console.log('test 2')
  })
})
```
> 결과
```
● Console
    console.log __tests__/calc.test.js:5
      beforeAll
    console.log __tests__/calc.test.js:11
      beforeEach
    console.log __tests__/calc.test.js:18
      test 1
    console.log __tests__/calc.test.js:14
      afterEach
    console.log __tests__/calc.test.js:11
      beforeEach
    console.log __tests__/calc.test.js:22
      test 2
    console.log __tests__/calc.test.js:14
      afterEach
    console.log __tests__/calc.test.js:8
      afterAll
```

# Ch05-06. Jest Matchers
## Common Matchers
## Expect
### Expect
- expect(value)
### Modifier
- .not, .resolve, rejesct
### Asymmetric Matchers
### Matchers
- .toBe(value)
> 원시 데이터 비교(primitive values)
- .toEqual(value)
> 객체 데이터 비교

# Ch05-07. Jest 비동기 테스트 - done
## async.test.js
- fail - undefined
```
function asyncFn () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Passes!')
    }, 1000)
  })
}

describe('비동기', () => {
  test('done', () => {
    let result
    asyncFn().then(r => {
      result = r
    })
    expect(result).toBe('Passes!')
  })
})
```
> result = undefined
- success
```
describe('비동기', () => {
  test('done', (done) => {
    asyncFn().then(r => {
      expect(r).toBe('Passes!')
      done()
    })
  })
})
```
> done 이란 매개변수를 실행할때까지 기다림  
!주의, 실행하지 안할시 Timeout Error

# Ch05-08. Jest 비동기 테스트 - then, resolves, async_await
## async.test.js
```
describe('비동기', () => {
  test('then', () => {
    return asyncFn().then(r => {
      expect(r).toBe('Passes!')
    })
  })

  test('resolves', () => {
    return expect(asyncFn()).resolves.toBe('Passes!')
  })

  test('async/await', async () => {
    const r = await asyncFn()
    expect(r).toBe('Passes!')
  })
})
```
> resolves: Promise 객체의 실행 결과, return 필요  
async/await 가장 많이 사용하느 패턴, return 필요 없다

# Ch05-09. Jest 비동기 테스트 - timeout
```
function asyncFn () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Passes!')
    }, 6000)
  })
}

describe('비동기', () => {
  test('async/await', async () => {
    const r = await asyncFn()
    expect(r).toBe('Passes!')
  }, 10000)
})
```
- test(name, fn, timeout)
> The default timeout is 5 seconds, timeout arg

# Ch05-10. Vue Test Utils(VTU) 개요
## HelloWord.vue
```
<template>
  <h1>Hello <message msg="World!"/></h1>
</template>
<script>
import Message from './Message'

export default {
  components: {
    Message
  }
}
</script>
```
## Message.vue
```
<template>
  <span>{{ msg }}</span>
</template>
<script>
export default {
  props: {
    msg: String
  }
}
</script>
```
## App.vue
```
<template>
  <div id="app">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```
## /src/components/__tests__/HelloWorld.test.js
```
```
> jest는 Vue 컴포넌트를 인식할 수 없다
>> `Vue Test Utils`
- mount
컴포넌트를 테스트 환경에 연결

## Ch05-11. VTU API
### mount()
- Args
> {Components} components
{object} options
- Returns: {Wrapper}
### shallowMount()
컴포넌트를 테스트 환경에 연결하는 역할
### createLocalVue()
가상의 로컬 뷰를 생성해서 연결 시켜주는 역할
```
import { createLocalVue, shallowMount } from '@vue/test-utils'
import MyPlugin from 'my-plugin'
import Foo from './Foo.vue'

const localVue = createLocalVue()
localVue.use(Myplugin)
const wrapper = shallowMount(Foo, {
  localVue,
  mocks: { foo: true}
})
expect(wrapper.vm.foo).toBe(true)
```
> const localVue = createLocalVue(), localVue.use(Myplugin)

# Ch05-12. VTU Mounting options
## Mounting Options
### context
템플릿 문법을 사용하지 않는 별개의 뷰 컴포넌트
### data
특정 데이터 변경
### slots
slot영역에 들어가는 내용 설정
### scopedSlots
### `stubs`
특정한 컴포넌트를 가짜로 만드는 것
### mocks
모의객체를 만듬
### LocalVue
createLocalVue 객체를 LocalVue와 연결
### attachTo
window객체나 document를 상용하기 위해 연결하기 위함
```
wrapper = mount(Components, {
  attachTo: document.getElementById('root')
})
```
### attachToDocument
attachTo 권장, Deprecated
### attrs
$attrs, vm.$attrs  
부모 객체 속성 바인딩
### propsData
props 데이터 넘겨주는 것
### listeners
부모 요소의 이벤트들을 한번에 몰아서 넘겨줌, vm.$listeners 
### parentComponent
부모 요소 컴포넌트를 연결하는 것
### provide
### Other options

# Ch05-13. VTU mount vs. shallowMount
## HelloWorld.test.js
- shallowMount와 mount의 차이
```
import { mount, shallowMount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld'

describe('HelloWorld Component', () => {
  test('mount', () => {
    const wrapper = mount(HelloWorld)
    console.log(wrapper.html())
    expect(wrapper.text()).toBe('Hello World!')
  })

  test('shallowMount', () => {
    const wrapper = shallowMount(HelloWorld)
    console.log(wrapper.html())
    expect(wrapper.text()).toBe('Hello')
  })
})
```
> failed, Received: "Hello"  
shallowMount > mount, success  
- mount: 하위 컴포넌트까지 mount  
- shaloow: 지정한 컴포넌트만 mount
> mount 보단 shallowMount 권장
- jest CLI opts: --watch
> $jest --watch

# Ch05-14. VUT Wrapper - 속성
## Properies
### vm
Vue Instance
> wrapper.vm
### element
the root DOM node
## Message.test.js
```
import { shallowMount } from "@vue/test-utils";
import Message from '../Message'

describe('Message Component', () => {
  test('1', () => {
    const wrapper = shallowMount(Message, {
      propsData: {
        msg: 'World?'
      }
    })
    expect(wrapper.vm.msg).toBe('World?')
    expect(wrapper.element.tagName).toBe('SPAN')
  })
})
```
> wrapper.vm.msg, wrapper.element.tagName
shallowMount(component, { mount opts })

# Ch05-15. VTU Wrapper - 메소드1
## attributes - HTML 속성
Returns Wrapper DOM node attributes
> wrapper.attributes().id, wrapper.attributes('id')
## contains
Assert Wrapper contains an `element or component` matching `selector`
- Arguments
> {stirng|component}
## emitted
- desc
```
wrapper.vm.$emit('foo')
wrapper.vm.$emit('foo', 123)
await wrapper.vm.$nextTick()

/*
wrapper.emitted() Returns the following object:
{
  foo: [[], [123]]
}
*/
expect(wrapper.emitted().foo).toBeTruthy()
expect(wrapper.emitted().foo.length).toBe(2)
expect(wrapper.emitted().foo[1].length).toEquals([123])
```

# Ch05-16. VTU Wrapper - 메소드2
## exists
```
import { mount } from '@vue/test-utils'
import Component from './Component.vue'

test('exists', () => {
  const wrapper = mount(Component)

  expect(wrapper.find('span').exists()).toBe(true)
  expect(wrapper.find('p').exists()).toBe(false)
})
```
## find
Returns Wrapper of first DOM node
## findAll
Returns a WrapperArray
## html
Returns HTML of Wrapper DOM node as a string
## setData
Sets Wrapper vm data
## setMethods, setProps
> setData, setMethods, setProps 반응성

# Ch05-17. VTU WrapperArray
A WrapperArray is an `object` that contains an array of Wrappers, and methods to test the Wrappers.
## Properties
### wrappers
array (read-only): the Wrappers contained in the WrapperArray
### length
## Methods
배열 데이터는 대괄호[] 사용하지만, 객체데이터는 대괄호 사용X
### at
Returns Wrapper at index passed
- Arguments:
> {number} index
- Returns: {Wrapper}
- Example
```
const divArray = wrapper.findAll('div')

const secondDiv = divArray.at(1)
expect(secondDiv.is('div')).toBe(true)

const lastDiv = divArray.at(-1) // 뒤에서 부터
expect(lastDiv.is('div')).toBe(true)
```
> at(1), at(-1)
## Message.vue
```
<template>
  <div>
    <span>1</span>
    <h1>2</h1>
    <p>3</p>
  </div>
</template>
<script>
export default {
  props: {
    msg: String
  }
}
</script>
```
## Message.test.js
```
import { shallowMount } from "@vue/test-utils";
import Message from '../Message'

describe('Message Component', () => {
  test('1', () => {
    const wrapper = shallowMount(Message)
    const wrapperArray = wrapper.findAll('div > *')

    expect(wrapperArray.length).toBe(3)
    expect(wrapperArray.at(1).text()).toBe('2')
  })
})
```
> wrapperArray.length, wrapperArray.at(1).text()

# Ch05-18. Mocking - 컴포넌트생성
## Jest - Mock Functions
## TodoTitle.vue
```
<template>
  <div>

  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      todo: {}
    }
  },
  created () {
    this.fetchTodo()
  },
  methods: {
    async fetchTodo () {
      const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
      console.log(res)
      this.todo = res
    }
  }
}
</script>
```
## App.vue
TodoTitle 연결
## axios 설치
```
$ npm i axios
# or
$ npm i axios@0.19.2
```
> 0.19.2

# Ch05-19. Mocking - 모의함수
## TodoTitle.test.js
```
import { shallowMount } from '@vue/test-utils'
import TodoTitle from '../TodoTitle'
import axios from 'axios'

describe('TodoTitle component', () => {
  let wrapper
  beforeEach(() => {
    // 모의함수 Mock 함수
    const res = {
      data: {
        title: "delectus aut autem"
      }
    }
    // axios.get = jest.fn(() => {
    //   return new Promise(resolve => {
    //     resolve(res)
    //   })
    // })
    axios.get = jest.fn().mockResolvedValue(res)
    wrapper = shallowMount(TodoTitle)
  })

  test('가져온 테스를 렌더링', () => {
    expect(wrapper.text()).toBe('delectus aut autem')
  })
})
```
> 네트워크를 끄면 테스트를 할 수 없다, 외부 요인에 의존하는 테스트는 좋지 않다
>> jest.fn().mockResolvedValue(val)

# Ch05-20. Mocking - Spy와 모의모듈
