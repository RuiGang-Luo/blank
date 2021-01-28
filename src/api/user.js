import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/core/oauth/token', //
    method: 'post',
    params: data
  })
}

export function removeRefreshTokenUsingClientId (data) {
  return request({
    url: '/core/auth/removeRefreshTokenUsingClientId',
    method: 'post',
    params: data
  })
}

export function getInfo (access_token) {
  return {
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
  }
}

export function logout (access_token) {
  return request({
    url: '/core/auth/logout',
    method: 'delete',
    params: {
      access_token
    }
  })
}
/* 根据客户编号和密码查询用户数据信息*/
export function queryActiveUser (id, pwd) {
  return request({
    url: '/business/user/selectAcriveUser',
    method: 'post',
    params: { id, pwd }
  })
}
/* 根据客户编号修改密码操作*/
export function changeActiveUserPwd (actIdUser) {
  return request({
    url: '/business/user/updateAcriveUserPwd',
    method: 'post',
    data: {
      id: actIdUser.id,
      pwd: actIdUser.pwd
    }
  })
}
