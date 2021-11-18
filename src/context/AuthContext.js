import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'

export const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser)
  const [userInfo, setUserInfo] = useState({})
  const [loading, setLoading] = useState(true)
  const [allMovies, setAllMovies] = useState([])

  const signup = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password)

  const login = async (email, password) => {
    await auth.setPersistence('local')
    await auth.signInWithEmailAndPassword(email, password)
  }
  const logout = () => auth.signOut()

  const resetPassword = (email) => auth.sendPasswordResetEmail(email)

  const updateEmail = (email) => auth.currentUser.updateEmail(email)

  const updatePassword = (password) => auth.currentUser.updatePassword(password)

  const getUserDate = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .get()
      .then((docs) => {
        setUserInfo(docs.data())
      })
  }

  const getAllMovies = () => {
    db.collection('movies')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          console.log(doc.id, " => ", doc.data())
        })
        setUserInfo(querySnapshot.data())
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
  }



  useEffect(() => {
    const unsubscribe = () => auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)

      if (user) {
        db.collection('users')
          .doc(user.uid)
          .get()
          .then((docs) => {
            setUserInfo(docs.data())
          })
      }
    })

    return unsubscribe()
  }, [])

  const value = {
    userInfo,
    setUserInfo,
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    getUserDate,
  }

  return (
    <AuthContext.Provider value={ value }>
      { !loading && children }
    </AuthContext.Provider>
  )
}
