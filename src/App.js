import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { initializeUsers } from './reducers/usersReducer'
import { getAllNotes } from './reducers/noteReducer'

// Components in english
import Client from './components/English/Client'
import Editform from './components/English/EditForm'
import ExerciseLibrary from './components/English/ExerciseLibrary'
import Footer from './components/English/Footer'
import Frontpage from './components/English/Frontpage'
import MainMenu from './components/English/MainMenu'
import MyClients from './components/English/MyClients'
import MyProgram from './components/English/MyProgram'
import SignInForm from './components/English/SignInForm'
import SignUpForm from './components/English/SignUpForm'
import UserProfile from './components/English/UserProfile'

// Components in Finnish
import ClientFin from './components/Finnish/ClientFin'
import EditformFin from './components/Finnish/EditFormFin'
import ExerciseLibraryFin from './components/Finnish/ExerciseLibraryFin'
import FooterFin from './components/Finnish/FooterFin'
import FrontpageFin from './components/Finnish/FrontpageFin'
import MainMenuFin from './components/Finnish/MainMenuFin'
import MyClientsFin from './components/Finnish/MyClientsFin'
import MyProgramFin from './components/Finnish/MyProgramFin'
import SignInFormFin from './components/Finnish/SignInFormFin'
import SignUpFormFin from './components/Finnish/SignUpFormFin'
import UserProfileFin from './components/Finnish/UserProfileFin'

// Components in Spanish
import ClientEsp from './components/Spanish/ClientEsp'
import EditformEsp from './components/Spanish/EditFormEsp'
import ExerciseLibraryEsp from './components/Spanish/ExerciseLibraryEsp'
import FooterEsp from './components/Spanish/FooterEsp'
import FrontpageEsp from './components/Spanish/FrontpageEsp'
import MainMenuEsp from './components/Spanish/MainMenuEsp'
import MyClientsEsp from './components/Spanish/MyClientsEsp'
import MyProgramEsp from './components/Spanish/MyProgramEsp'
import SignInFormEsp from './components/Spanish/SignInFormEsp'
import SignUpFormEsp from './components/Spanish/SignUpFormEsp'
import UserProfileEsp from './components/Spanish/UserProfileEsp'

const App = () => {
  const dispatch = useDispatch()
  const userLanguage = useSelector(state => state.language)
  const UILanguage = userLanguage ? userLanguage : 'eng'
  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(getAllNotes())
  }, [dispatch])
  console.log('UI LANGUAGE: ', UILanguage)

  if (UILanguage === 'eng') {
    return (
      <div >
        <Router>
          <MainMenu />
          <Switch>
            <Route path="/eng/clients/:id">
              <Client />
            </Route>
            <Route exact={true} path="/">
              <Redirect to="/eng/frontpage" />
            </Route>
            <Route path="/eng/signUp" >
              <SignUpForm />
            </Route>
            <Route path="/eng/signIn" >
              <SignInForm />
            </Route>
            <Route path="/eng/profile">
              <UserProfile />
            </Route>
            <Route path="/eng/editForm">
              <Editform />
            </Route>
            <Route>
              <Frontpage path="/eng/frontpage" />
            </Route>
            <Route path="/eng/myprogram">
              <MyProgram />
            </Route>
            <Route path="/eng/exercises">
              <ExerciseLibrary />
            </Route>
            <Route path="/eng/clients">
              <MyClients />
            </Route>
          </Switch>
        </Router>
        <Footer />
      </div >
    )
  } else if (UILanguage === 'fin') {
    return (
      <div>
        <Router>
          <MainMenuFin />
          <Switch>
            <Route path="/fin/clients/:id">
              <ClientFin />
            </Route>
            <Route path="/fin/signUp" >
              <SignUpFormFin />
            </Route>
            <Route path="/fin/signIn" >
              <SignInFormFin />
            </Route>
            <Route path="/fin/profile">
              <UserProfileFin />
            </Route>
            <Route path="/fin/editForm">
              <EditformFin />
            </Route>
            <Route path="/fin/frontpage">
              <FrontpageFin />
            </Route>
            <Route path="/fin/myprogram">
              <MyProgramFin />
            </Route>
            <Route path="/fin/exercises">
              <ExerciseLibraryFin />
            </Route>
            <Route path="/fin/clients">
              <MyClientsFin />
            </Route>
          </Switch>
        </Router>
        <FooterFin />
      </div>
    )
  } else if (UILanguage === 'esp') {
    return (
      <div>
        <Router>
          <MainMenuEsp />
          <Switch>
            <Route path="/esp/clients/:id">
              <ClientEsp />
            </Route>
            <Route path="/esp/signUp" >
              <SignUpFormEsp />
            </Route>
            <Route path="/esp/signIn" >
              <SignInFormEsp />
            </Route>
            <Route path="/esp/profile">
              <UserProfileEsp />
            </Route>
            <Route path="/esp/editForm">
              <EditformEsp />
            </Route>
            <Route path="/esp/frontpage">
              <FrontpageEsp />
            </Route>
            <Route path="/esp/myprogram">
              <MyProgramEsp />
            </Route>
            <Route path="/esp/exercises">
              <ExerciseLibraryEsp />
            </Route>
            <Route path="/esp/clients">
              <MyClientsEsp />
            </Route>
          </Switch>
        </Router>
        <FooterEsp />
      </div>
    )
  }
}

export default App