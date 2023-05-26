# Part5. Vue 프로젝트 - Local DB를 활용한 Todo List 만들기 (3)
https://github.com/HeropCode/Vue-Todo-app [완성본]

# ch04.01. 스타일 개요 - 설명
## Reset.css
브라우저의 기본 스타일을 초기화
```
<link href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" rel="stylesheet">
```
> 기본 스타일을 통일화, nomalize/Reset.css
## Google Material Icons
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```
```
<i class="material-icons">done</i>
<i class="material-icons">close</i>
```
## Google Fonts
```
<link href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700&display=swap&subset=korean" rel="stylesheet">
```
## Default styles
`scss/_style.scss`을 생성하고 완성된 스타일 내용을 사용해 다음과 같이 TodoApp.vue에 적용합니다.
```
<!-- TodoApp.vue -->

<template>...</template>
<script>...</script>
<style lang="scss">
  @import "../scss/style";
</style>
```

# ch04-02. 스타일 개요 - 적용
## index.html
```
<link href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700&display=swap&subset=korean" rel="stylesheet">
```
## scss/_style.scss 파일 생성
`_` SCSS partials 개념
> git에 코드 복붙
## TodoApp.vue
```
<style lang="scss">
  @import "../scss/style"
</style>
```

# ch04-03. TodoItem 스타일
## TodoItem.vue - 버튼, 체크 변경
```
<label>
  <input 
    v-model="done"
    type="checkbox"
  >
  <span class="icon"><i class="material-icons">check</i></span>
</label>

<button 
  class="btn"
  key="update"
  @click="onEditMode">
  <i class="material-icons">edit</i>
</button>
<button 
  class="btn btn--danger"
  key="delete"
  @click="deleteTodo">
  <i class="material-icons">delete</i>  
</button>
```

# ch04-04. TodoCreator 스타일
## TodoCreator.vue - scroll
```
methods: {
  createTodo () {
    const validatedTitle = this.title && this.title.trim()
    if (!validatedTitle) {
      alert('유효하지 않은 제목 입니다!')
      this.title = this.title.trim()
      return
    }
    
    this.$emit('create-todo', this.title)
    this.title = ''

    this.$nextTick(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  }
}
```
> window.scrollTo(0, document.body.scrollHeight)

# ch04-05. TodoApp 스타일
## TodoApp.vue 
```
<div class="actions clearfix">
  <div class="float--left">
    <label>
      <input 
        v-model="allDone"
        type="checkbox"
      />
      <span class="icon"><i class="material-icons">done_all</i></span>
    </label>
  </div>
  <div class="float--right clearfix">
    <button 
      class="btn float--left"
      @click="scrollToTop">
      <i class="material-icons">expand_less</i>
    </button>
    <button
      class="btn float--left"
      @click="scrollToBottom">
      <i class="material-icons">expand_more</i>
    </button>
    <button 
      class="btn btn--danger float--left"
      @click="clearCompleted">
      <i class="material-icons">delete_sweep</i>
    </button>  
  </div>
</div>
```
## scroll-to-npm
### install
```
$ npm i scroll-to
# or
$ npm i scroll-to@0.0.2
```
## TodoApp.vue
```
import scrollTo from 'scroll-to'

methods: {
  scrollToTop () {
    scrollTo(0, 0, {
      ease: 'linear'
    })
  },
  scrollToBottom () {
    scrollTo(0, document.body.scrollHeight, {
      ease: 'linear'
    })
  }
}
```