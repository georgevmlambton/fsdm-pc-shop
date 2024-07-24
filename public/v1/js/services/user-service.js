class UserService {
  generateRandomUsername() {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let randomString = ''

    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      randomString += charset.charAt(randomIndex)
    }

    return randomString
  }
  getUser() {
    var userName = localStorage.getItem('userName')
    if (!userName) {
      userName = this.generateRandomUsername()
      localStorage.setItem('userName', userName)
    }
    return userName
  }
  getAuth() {
    return 'Basic ' + btoa(`${userService.getUser()}:`)
  }
}

var userService = new UserService()
