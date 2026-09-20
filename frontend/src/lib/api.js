const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

async function fetchApi(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = localStorage.getItem('classcheck_token')

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `API request failed (${response.status})`

    try {
      const data = await response.json()

      if (data?.details?.length) {
        errorMessage = data.details
          .map((detail) => `${detail.field}: ${detail.message}`)
          .join('\n')
      } else {
        errorMessage =
          data?.message ||
          data?.error ||
          errorMessage
      }
    } catch {
      const text = await response.text().catch(() => '')

      if (text) {
        errorMessage = text
      }
    }

    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    return response.text()
  }

  return response.json()
}

function saveAuth(data) {
  if (!data) return data

  const token =
    data.token ||
    data.accessToken ||
    data.access_token

  const user =
    data.user ||
    data.profile ||
    data.account

  if (token) {
    localStorage.setItem('classcheck_token', token)
  }

  if (user) {
    localStorage.setItem(
      'classcheck_user',
      JSON.stringify(user)
    )
  }

  return data
}

export const api = {
  // ================================================================
  // AUTH
  // ================================================================

  signUpStudent: async (data) => {
    const result = await fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return saveAuth(result)
  },

  signInStudent: async (data) => {
    const result = await fetchApi('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return saveAuth(result)
  },

  signInSender: async (data) => {
    const result = await fetchApi('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return saveAuth(result)
  },

  signInAdmin: async (data) => {
    const result = await fetchApi('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return saveAuth(result)
  },

  signOut: async () => {
    try {
      await fetchApi('/auth/signout', {
        method: 'POST',
      })
    } finally {
      localStorage.removeItem('classcheck_token')
      localStorage.removeItem('classcheck_user')
    }
  },

  getSession: async () => {
    const token = localStorage.getItem('classcheck_token')
    const userString = localStorage.getItem('classcheck_user')

    if (!token || !userString) {
      return {
        user: null,
        token: null,
      }
    }

    try {
      return {
        user: JSON.parse(userString),
        token,
      }
    } catch {
      localStorage.removeItem('classcheck_user')

      return {
        user: null,
        token,
      }
    }
  },

  // These routes do NOT exist in the backend you provided.
  resetPassword: () => {
    throw new Error(
      'Password reset is not available in the current backend API.'
    )
  },

  updatePassword: () => {
    throw new Error(
      'Password update is not available in the current backend API.'
    )
  },

  // ================================================================
  // PROFILE
  // ================================================================

  getMyProfile: () =>
    fetchApi('/profile/me'),

  getProfile: (id) =>
    fetchApi(`/profile/${id}`),

  updateProfile: (data) =>
    fetchApi('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // ================================================================
  // DEPARTMENTS
  // ================================================================

  getDepartments: () =>
    fetchApi('/departments'),

  createDepartment: (data) =>
    fetchApi('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Compatibility with old frontend naming.
  getCourses: () =>
    fetchApi('/departments'),

  // ================================================================
  // POSTS
  // ================================================================

  getPosts: () =>
    fetchApi('/posts'),

  getPost: (id) =>
    fetchApi(`/posts/${id}`),

  createPost: (data) =>
    fetchApi('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePost: (id, data) =>
    fetchApi(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePost: (id) =>
    fetchApi(`/posts/${id}`, {
      method: 'DELETE',
    }),

  // Compatibility with old frontend naming.
  getFeed: () =>
    fetchApi('/posts'),

  postUpdate: (data) =>
    fetchApi('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSenderHistory: () =>
    fetchApi('/posts'),

  deleteUpdate: (updateId) =>
    fetchApi(`/posts/${updateId}`, {
      method: 'DELETE',
    }),

  // ================================================================
  // REACTIONS
  // ================================================================

  getPostReactions: (postId) =>
    fetchApi(`/posts/${postId}/reactions`),

  reactToPost: (postId, data) =>
    fetchApi(`/posts/${postId}/reactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  unreactToPost: (postId) =>
    fetchApi(`/posts/${postId}/reactions`, {
      method: 'DELETE',
    }),

  // ================================================================
  // NOTIFICATIONS
  // ================================================================

  getNotifications: () =>
    fetchApi('/notifications'),

  markAllNotificationsRead: () =>
    fetchApi('/notifications/read-all', {
      method: 'PUT',
    }),

  markNotificationRead: (notificationId) =>
    fetchApi(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),

  // ================================================================
  // OLD ENDPOINTS THAT DO NOT EXIST IN THE NEW BACKEND
  // ================================================================

  getStudentSubscriptions: () => {
    throw new Error(
      'Student subscriptions are not available in the current backend API.'
    )
  },

  updateSubscriptions: () => {
    throw new Error(
      'Student subscriptions are not available in the current backend API.'
    )
  },

  deleteAccount: () => {
    throw new Error(
      'Account deletion is not available in the current backend API.'
    )
  },

  getSenderCourses: () => {
    throw new Error(
      'Sender courses are not available in the current backend API.'
    )
  },

  getOverviewMetrics: () => {
    throw new Error(
      'Admin overview is not available in the current backend API.'
    )
  },

  getSenders: () => {
    throw new Error(
      'Admin sender management is not available in the current backend API.'
    )
  },

  updateSenderStatus: () => {
    throw new Error(
      'Admin sender status management is not available in the current backend API.'
    )
  },

  deleteSender: () => {
    throw new Error(
      'Admin sender deletion is not available in the current backend API.'
    )
  },

  createSender: () => {
    throw new Error(
      'Admin sender creation is not available in the current backend API.'
    )
  },

  deleteCourse: () => {
    throw new Error(
      'Admin course deletion is not available in the current backend API.'
    )
  },

  createCourse: () => {
    throw new Error(
      'Admin course creation is not available in the current backend API.'
    )
  },

  getAllUpdates: () => {
    throw new Error(
      'Admin update listing is not available in the current backend API.'
    )
  },

  joinWaitlist: () => {
    throw new Error(
      'Waitlist is not available in the current backend API.'
    )
  },
}

export {
  BASE_URL,
  fetchApi,
}