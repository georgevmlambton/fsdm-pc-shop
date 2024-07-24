export const generateRandomUsername = () => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''

  for (let i = 0; i < 15; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    randomString += charset.charAt(randomIndex)
  }

  return randomString
}

export const getUser = () => {
  var userName = localStorage.getItem('userName')
  if (!userName) {
    userName = generateRandomUsername()
    localStorage.setItem('userName', userName)
  }
  return userName
}
export const getAuth = () => {
  return 'Basic ' + btoa(`${getUser()}:`)
}
