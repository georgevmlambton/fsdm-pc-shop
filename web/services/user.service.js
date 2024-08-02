class UserService {
  url = '/api'
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
    // return 'Basic ' + btoa(`${userService.getUser()}:`)
    return `Bearer ${this.getUserToken()}`
  }

  getUserToken() {
    let token = null
    if (localStorage.getItem('token')) {
      token = localStorage.getItem('token')
    } else if (sessionStorage.getItem('token')) {
      token = sessionStorage.getItem('token')
    }
    return token
  }

  setUserToken(token, stayLoggedIn) {
    stayLoggedIn
      ? localStorage.setItem('token', token)
      : sessionStorage.setItem('token', token)
  }

  async login(email, password, stayLoggedIn) {
    try {
      const response = await fetch(`${this.url}/auth/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      this.setUserToken(data.token, stayLoggedIn)
      return data
    } catch (e) {
      throw new Error(e)
    }
  }

  async checkToken() {
    try {
      const response = await fetch(`${this.url}/auth/login`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuth(),
        },
        method: 'GET',
      })
      const data = await response.json()
      return data
    } catch (e) {
      throw new Error(e)
    }
  }

  async register(name, email, password) {
    try {
      const response = await fetch(`${this.url}/auth/register`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      return data
    } catch (e) {
      throw new Error(e)
    }
  }

  logout() {
    localStorage.removeItem('token')
  }
}

const userService = new UserService()

export default userService
