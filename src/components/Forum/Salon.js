import React, { useEffect, useState } from 'react'
import { Transition } from '@tailwindui/react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useField } from '../../hooks/index'
import { setNotification } from '../../reducers/notificationReducer'
import { userLogin } from '../../reducers/loginReducer'
import loginService from '../../services/login'
import localdb from '../../utils/localdb'
import DiscussionsList from './DiscussionsList'
import { createDiscussion } from '../../reducers/discussionReducer'
var _ = require('lodash')

const Salon = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const loggedUser = useSelector(state => state.loggedUser)
  const discussions = useSelector(state => state.discussions)
  const [showTopMenu, setShowTopMenu] = useState(false)
  const [showTopicMenu, setShowTopicMenu] = useState(false)
  const [topic, setTopic] = useState(null)
  const [topicList, setTopicList] = useState([])
  const [showTopicOptions, setShowTopicOptions] = useState(false)
  const [filter, setFilter] = useState(null)
  const username = useField('text')
  const password = useField('password')
  const author = useField('text')
  const discussionContent = useField('text')
  const discussionTitle = useField('text')
  const typedTopic = useField('text')

  const loginAgain = localdb.loadUserInfo(username.params.value)
  if (loginAgain) {
    if (username.params.value === loginAgain.username) {
      password.params.value = loginAgain.password
    }
  }

  const handleLogin = async event => {
    event.preventDefault()
    const credentials = {
      username: username.params.value.toLowerCase(),
      password: password.params.value,
    }

    try {
      var user = await loginService.login(credentials)
      dispatch(userLogin(user))
      if (user.userType === 'client') {
        dispatch(
          setNotification({
            message: t('Signin.Welcome') + user.username + t('Signin.SessionWelcome'),
            title: 'Success',
            show: true,
          })
        )
        username.reset()
        password.reset()
      } else {
        dispatch(
          setNotification({
            message: t('Signin.Welcome') + user.username,
            title: 'Success',
            show: true,
          })
        )
      }
    } catch (error) {
      dispatch(
        setNotification({
          message: `${error.response.data.error}`,
          title: 'Login error',
          show: true,
        })
      )
    }
  }

  const topics = ['Other', 'Exercise', 'Nutrition']
  useEffect(() => {
    if (discussions.length > 0) {
      setTopicList(_.uniq(_.map(discussions, 'topic')).sort())
    }
  }, [setTopicList])

  const handleTopic = topic => {
    setTopic(topic)
    setShowTopicMenu(!showTopicMenu)
  }

  const handleFilter = topic => {
    setFilter(topic)
    setShowTopicOptions(!showTopicOptions)
  }

  const handleClearFields = () => {
    author.reset()
    discussionContent.reset()
    discussionTitle.reset()
    setTopic(null)
  }

  const handlePostDiscussion = () => {
    const newDiscussion = {
      userId: loggedUser ? loggedUser.id : 'visitor',
      topic: topic === 'Other' ? typedTopic.params.value : topic,
      author: loggedUser ? loggedUser.username : author.params.value,
      title: discussionTitle.params.value,
      content: discussionContent.params.value,
    }
    if (
      newDiscussion.author.length > 3 &&
      newDiscussion.topic.length > 4 &&
      discussionTitle.params.value.length > 9 &&
      discussionContent.params.value.length > 49
    ) {
      try {
        dispatch(createDiscussion(newDiscussion))
        dispatch(
          setNotification({
            message: 'Your discussion has been succesfully created',
            title: 'Sucess',
            show: true,
          })
        )
        setTopic(null)
        typedTopic.reset()
        author.reset()
        discussionTitle.reset()
        discussionContent.reset()
      } catch (error) {
        console.log('ERROR:', error.response.data.error)
      }
    }
  }

  if (!discussions) {
    return (
      <div className="justify-center items-center flex outline-none bg-gray-100 min-h-screen">
        <div className="flex flex-row space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          <p className="pr-2">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-white to-gray-200 pt-20 md:pt-20 ">
      <h1 className="text-xs text-justify bg-blue-100 p-3 md:pl-5 md:pr-5 border-b-2 border-gray-600">
        {t('Salon.Welcome')}
        <Link to="/codeofconduct" target="blank" className="transition duration-300 text-indigo-500 hover:text-red-400">
          {t('Salon.Code')}
        </Link>
        .{t('Salon.KeepInMind')}
      </h1>
      <div className="flex items-center bg-gradient-to-br from-gray-400 via-gray-200 to-transparent ">
        <button
          id="show-menu-button"
          className="focus-within:outline-none p-1 pl-3"
          onClick={() => setShowTopMenu(!showTopMenu)}
        >
          {t('Salon.Menu')}
        </button>
        <div
          className={
            showTopMenu
              ? 'transition duration-500 transform rotate-90 focus-within:outline-none p-1'
              : 'transition duration-75 focus-within:outline-none p-1'
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="relative w-full">
        <Transition
          show={showTopMenu}
          enter="transition transform duration-500 ease-out"
          enterFrom="-translate-y-4 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition transform duration-75 ease-out"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="-translate-y-4 opacity-0"
        >
          <div className="flex flex-col md:flex-row md:space-x-2 md:items-start p-3 bg-gradient-to-br from-gray-300 via-white to-gray-300 border-b-2 border-gray-300 mb-2">
            <div className="md:w-2/3 border-b-2 border-gray-300 mb-1 md:mb-0 pb-1 md:pb-0 md:border-b-0">
              <div>
                <div className="md:mb-1">
                  <div className="md:flex md:items-center md:space-x-2 mb-1">
                    <div
                      name="topic"
                      type="text"
                      className="h-9 w-60 border border-gray-300 focus:ring-0 bg-white rounded-md shadow-sm md:text-base text-left"
                    >
                      <div className="flex justify-between ">
                        {topic ? (
                          <div className="flex justify-between w-48 text-sm text-gray-500 pr-2">
                            <div className="">{topic}</div>
                            <div onClick={() => setTopic(null)} className="opacity-50 cursor-pointer">
                              X
                            </div>
                          </div>
                        ) : (
                          <div className="opacity-25 text-sm text-center ">{t('Salon.SelectTopic')}</div>
                        )}
                        <div>
                          <span
                            className="flex items-center border-l pl-1 cursor-pointer"
                            id="topic-menu"
                            onClick={() => setShowTopicMenu(!showTopicMenu)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      {topic === 'Other' ? (
                        <input
                          className="border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent focus-within:outline-none rounded-md h-9 w-60 text-sm placeholder-gray-200"
                          {...typedTopic.params}
                          placeholder={t('Salon.TopicPlaceholder')}
                          title="A topic is required"
                          minLength="5"
                          required
                        />
                      ) : null}
                    </div>
                    {topic === 'Other' ? (
                      <div className="">
                        {typedTopic.params.value.length < 5 ? (
                          <span className="text-red-900 text-xs pl-2 md:pl-0">
                            {t('Salon.TopicCharac') + `${typedTopic.params.value.length}/5` + t('Salon.Minimum')}
                          </span>
                        ) : (
                          <p className="flex items-center">
                            <span className="text-sm pl-2 ">{'Topic'} </span>
                            <span className="transition duration-1000 text-sm text-green-500 ml-2 p-1 ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <Transition
                    show={showTopicMenu}
                    enter="transition transform duration-75 ease-out"
                    enterFrom="-translate-y-2 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition transform duration-75 ease-out"
                    leaveFrom="translate-y-0 opacity-100"
                    leaveTo="-translate-y-2 opacity-0"
                  >
                    <div
                      id="topic-dropdown"
                      className="absolute border rounded-b-md rounded-sm bg-white divide-y divide-gray-50 w-60"
                    >
                      {topics.sort().map(topic => (
                        <p
                          className="p-1 pl-2 text-sm text-gray-500 hover:bg-gray-500 hover:text-white cursor-pointer "
                          id={`${topic}`}
                          onClick={() => handleTopic(topic)}
                          key={topic}
                        >
                          {topic}
                        </p>
                      ))}
                    </div>
                  </Transition>
                </div>
              </div>
              <div className="">
                {loggedUser ? (
                  <label className="w-full bg-gray-300 rounded-t-md border-t-2 border-gray-500 pl-2 p-1 mb-0 text-xs">
                    {t('Discussion.Author')}: <span className="italic font-semibold">{loggedUser.username}</span>{' '}
                  </label>
                ) : (
                  <input
                    id="author-discussion-input"
                    {...author.params}
                    className="editform-input rounded-b-none"
                    placeholder={t('Discussion.Author')}
                    title="Author is required"
                    minLength="3"
                    required
                  />
                )}
                <input
                  id="title-discussion-input"
                  {...discussionTitle.params}
                  className="editform-input rounded-none h-9"
                  placeholder={t('Discussion.Title')}
                  title="Title is required"
                  minLength="10"
                  required
                />

                <textarea
                  id="content-discussion-input"
                  {...discussionContent.params}
                  className="text-area rounded-b-md"
                  placeholder={t('Salon.ContentPlaceholder')}
                  title={t('Salon.ContentRequired')}
                  minLength="50"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2 items-end md:flex-row md:items-center md:justify-between md:space-y-0 w-full p-1 pl-2 space-x-2">
                <div className="flex flex-col items-end md:items-start">
                  <div>
                    {discussionTitle.params.value.length < 10 ? (
                      <span className="text-red-900 text-xs">
                        {t('Salon.TitleCharac') + `${discussionTitle.params.value.length}/10` + t('Salon.Minimum')}
                      </span>
                    ) : (
                      <p className="flex items-center">
                        <span className="text-sm">{'Title'} </span>
                        <span className="transition duration-1000 text-sm text-green-500 ml-2 p-1 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    {discussionContent.params.value.length < 50 ? (
                      <span className="text-red-900 text-xs">
                        {t('Salon.ContentCharac') + `${discussionContent.params.value.length}/50` + t('Salon.Minimum')}
                      </span>
                    ) : (
                      <p className="flex items-center">
                        <span className="text-sm">{'Content'} </span>
                        <span className="transition duration-1000 text-sm text-green-500 ml-2 p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <button
                    className="buttons-web text-black bg-blue-100 p-1 pr-2 pl-2 "
                    id="clear-discussion-button"
                    onClick={handleClearFields}
                  >
                    {t('ButtonLabel.Discard')}
                  </button>
                  <button
                    className="buttons-web text-black bg-blue-100 p-1 pr-2 pl-2 "
                    id="post-discussion-button"
                    onClick={handlePostDiscussion}
                  >
                    {t('ButtonLabel.Post')}
                  </button>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 border-gray-400">
              <div>
                {loggedUser ? (
                  <div>
                    <p className="text-base text-center p-1">
                      {t('Salon.LoggedAs')}
                      <span className="italic font-semibold"> {loggedUser.username}</span>
                    </p>
                    <p className="text-center text-sm h-7 pt-1 bg-gray-300  rounded-t-md border-t-2 border-gray-500 md:mb-0">
                      {t('Salon.FindByTopics')}
                    </p>
                  </div>
                ) : (
                  <div className=" border-gray-500">
                    <p className="text-sm text-center">{t('Salon.AsLoggedUser')}</p>
                    <input
                      className="editform-input"
                      {...username.params}
                      id="forum-username-input"
                      name="username"
                      autoComplete="on"
                      pattern="[a-z0-9]{4,}"
                      placeholder={t('Signin.Username')}
                      title="Username is required"
                      required
                    />
                    <input
                      className="editform-input"
                      {...password.params}
                      id="forum-password-input"
                      name="password"
                      autoComplete="current-password"
                      placeholder={t('Signin.Password')}
                      title="Password is required"
                      required
                    />
                    <button id="salon-login-button" onClick={handleLogin} className="buttons-web w-full p-1 mt-1">
                      {t('Signin.SigninButton')}
                    </button>
                    <p className="text-center text-sm h-7 pt-1 bg-gray-400 rounded-t-md border-t-2 border-gray-500 mt-1 md:mb-0">
                      {t('Salon.FindByTopics')}
                    </p>
                  </div>
                )}
                <div className="relative md:mb-0.5 w-full">
                  <div className="md:flex md:items-center md:space-x-2 w-full">
                    <div
                      name="topic"
                      type="text"
                      className="h-9 w-full border border-gray-300 focus:ring-0 bg-white rounded-b-md shadow-sm md:text-base text-left"
                    >
                      <div className="flex justify-between ">
                        {filter ? (
                          <div className="flex justify-between w-full text-sm text-gray-500 pr-2">
                            <div className="">{filter}</div>
                            <div onClick={() => setFilter(null)} className="opacity-50 cursor-pointer">
                              X
                            </div>
                          </div>
                        ) : (
                          <div className="opacity-25 text-sm text-center ">{t('Salon.SelectTopic')}</div>
                        )}
                        <div>
                          <span
                            className="flex items-center border-l pl-1 cursor-pointer"
                            id="topic-filter-options"
                            onClick={() => setShowTopicOptions(!showTopicOptions)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Transition
                    show={showTopicOptions}
                    enter="transition transform duration-75 ease-out"
                    enterFrom="-translate-y-2 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition transform duration-75 ease-out"
                    leaveFrom="translate-y-0 opacity-100"
                    leaveTo="-translate-y-2 opacity-0"
                  >
                    <div
                      id="topic-dropdown"
                      className="absolute border rounded-b-md rounded-sm bg-white z-10 divide-y divide-gray-50 w-full"
                    >
                      {topicList.map(filter => (
                        <p
                          className="p-1 pl-2 text-sm text-gray-500 hover:bg-gray-500 hover:text-white cursor-pointer "
                          id={`${filter}`}
                          onClick={() => handleFilter(filter)}
                          key={filter}
                        >
                          {filter}
                        </p>
                      ))}
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        {/* discussion list */}
        <div className="border-separate border-r-2 border-gray-300">
          {discussions.length > 0 ? (
            filter ? (
              <DiscussionsList
                discussions={discussions.filter(discussion =>
                  discussion.topic.toLowerCase().includes(filter.toLowerCase())
                )}
              />
            ) : (
              <DiscussionsList discussions={discussions} />
            )
          ) : (
            <div className="flex flex-row items-center justify-around h-screen">
              <h1 className="text-center text-xl text-gray-500 shadow-md rounded-3xl bg-opacity-0 p-6">
                {t('Salon.NoDiscussions')}
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Salon
