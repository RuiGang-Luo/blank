const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    authorities: [
      {
        authority: 'ROLE_FLOWABLE_ADMIN'
      },
      {
        authority: 'access-admin'
      },
      {
        authority: 'access-idm'
      },
      {
        authority: 'access-modeler'
      },
      {
        authority: 'access-rest-api'
      },
      {
        authority: 'access-task'
      }
    ],
    details: {
      remoteAddress: '0:0:0:0:0:0:0:1',
      sessionId: null,
      tokenValue: 'c0ecf1cf-f4a1-4fb7-852b-5c118cc1961b',
      tokenType: 'Bearer',
      decodedDetails: null
    },
    authenticated: true,
    userAuthentication: {
      authorities: [
        {
          authority: 'ROLE_FLOWABLE_ADMIN'
        },
        {
          authority: 'access-admin'
        },
        {
          authority: 'access-idm'
        },
        {
          authority: 'access-modeler'
        },
        {
          authority: 'access-rest-api'
        },
        {
          authority: 'access-task'
        }
      ],
      details: {
        grant_type: 'password',
        username: 'admin'
      },
      authenticated: true,
      principal: {
        password: null,
        username: 'admin',
        authorities: [
          {
            authority: 'ROLE_FLOWABLE_ADMIN'
          },
          {
            authority: 'access-admin'
          },
          {
            authority: 'access-idm'
          },
          {
            authority: 'access-modeler'
          },
          {
            authority: 'access-rest-api'
          },
          {
            authority: 'access-task'
          },
          {
            authority: 'admin'
          }
        ],
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        enabled: true
      },
      credentials: null,
      name: 'admin'
    },
    credentials: '',
    oauth2Request: {
      clientId: 'antfin',
      scope: [
        'read'
      ],
      requestParameters: {
        grant_type: 'password',
        username: 'admin'
      },
      resourceIds: [],
      authorities: [
        {
          authority: 'ROLE_ADMIN'
        }
      ],
      approved: true,
      refresh: false,
      redirectUri: null,
      responseTypes: [],
      extensions: {},
      grantType: 'password',
      refreshTokenRequest: null
    },
    principal: {
      password: null,
      username: 'admin',
      authorities: [
        {
          authority: 'ROLE_FLOWABLE_ADMIN'
        },
        {
          authority: 'access-admin'
        },
        {
          authority: 'access-idm'
        },
        {
          authority: 'access-modeler'
        },
        {
          authority: 'access-rest-api'
        },
        {
          authority: 'access-task'
        },
        {
          authority: 'admin'
        }
      ],
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      enabled: true
    },
    clientOnly: false,
    name: 'admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/oauth/token',
    type: 'post',
    response: config => {
      const { username } = config.query
      const token = tokens[username]
      console.log(username)
      // mock error
      if (!token) {
        return {
          error: 'invalid_grant',
          error_description: 'Bad credentials'
        }
      }

      return {
        code: 200,
        msg: '',
        data: {
          access_token: token.token,
          token_type: 'bearer',
          refresh_token: 'e4dd286e-a2c8-413c-abce-bc6f6bea039d',
          expires_in: 3599,
          scope: 'read'
        }
      }
    }
  },

  // get user info
  {
    url: '/auth/userInfo',
    type: 'post',
    response: config => {
      const { access_token } = config.query
      const info = users[access_token]

      // mock error
      if (!info) {
        return {
          code: 500,
          msg: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 200,
        msg: '',
        data: info
      }
    }
  },

  // user logout
  {
    url: '/auth/logout',
    type: 'delete',
    response: config => {
      const { access_token } = config.query
      return {
        code: 200,
        msg: 'success'
      }
    }
  }
]
