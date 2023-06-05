function a () {
  console.log('a')
}
function b () {
  console.log('b')
}
a() // a
b() // b


function a () {
  setTimeout(function () {
    console.log('a')
  }, 1000)
}
function b () {
  console.log('b')
}
a()
b()
// b
// a


function a (cb){
  setTimeout(function () {
    console.log('a')
    cb()
  }, 1000)
}
function b () {
  console.log('b')
}
a(function () {
  b()
})
//a
//b


function a (cb){
  setTimeout(function () {
    console.log('a')
    cb()
  }, 1000)
}
function b (cb){
  setTimeout(function () {
    console.log('b')
    cb()
  }, 1000)
}
function c (cb){
  setTimeout(function () {
    console.log('c')
    cb()
  }, 1000)
}
function d (cb){
  setTimeout(function () {
    console.log('d')
    cb()
  }, 1000)
}
a(function (){
  b(function () {
    c(function () {
      d()
    })
  })
})
// a, b, c, d


function a() {
  return new Promise(resolove => {
    setTimeout(function () {
      console.log('a')
      resolve()
    }, 1000)
  })
}
function b() {
  return new Promise(resolove => {
    setTimeout(function () {
      console.log('b')
      resolve()
    }, 1000)
  })
}
function c() {
  return new Promise(resolove => {
    setTimeout(function () {
      console.log('c')
      resolve()
    }, 1000)
  })
}
function d() {
  return new Promise(resolove => {
    setTimeout(function () {
      console.log('d')
      resolve()
    }, 1000)
  })
}
a().then(res => b())
  .then(res => c())
  .then(res => d())


async function asyncFunction () {
  await a()
  await b()
  await c()
  await d()
  console.log('done')
}


function a () {
  return new Promise((resolve, reject) => {
    if(isError) {
      reject(Error)
    }
    setTimeout(() => {
      console.log(a)
      resolve('done')
    }, 1000)
  })
}

a()
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.log(error.message)
  })
  .finally(() => {

  })

async function asyncFunc () {
  try {
    const res = await a()
    console.log(res)
  } catch (error) {
    console.log(error.message)
  } finally {
    console.log('done!')
  }
}
asyncFunc()