export default [
  {
    url: '/service/selectByNameAndStatus',
    type: 'post',
    response: config => {
      console.log('到达mock——selectByNameAndStatus')
      return {
        code: 200,
        data: [
          { id: 'ls', serviceName: '出单', status: '1', callType: 'feign', dataType: 'xml', belongTo: '出单微服务' },
          { id: 'zhaos', serviceName: '退保', status: '2', callType: 'http', dataType: 'list', belongTo: '退保微服务' },
          { id: 'zs', serviceName: '承保', status: '2', callType: 'antfin', dataType: 'map', belongTo: '承保微服务' },
          { id: 'zhaos', serviceName: '出单前置校验', status: '2', callType: 'feign', dataType: 'map', belongTo: '出单微服务' },
          { id: 'ls', serviceName: '退保前置校验', status: '1', callType: 'feign', dataType: 'map', belongTo: '退保微服务' },
          { id: 'zhaos', serviceName: '退保', status: '2', callType: 'http', dataType: 'map', belongTo: '退保微服务' },
          { id: 'zs', serviceName: '承保', status: '2', callType: 'antfin', dataType: 'map', belongTo: '承保微服务' },
          { id: 'zhaos', serviceName: '出单前置校验', status: '2', callType: 'feign', dataType: 'map', belongTo: '出单微服务' },
          { id: 'ls', serviceName: '退保前置校验', status: '1', callType: 'feign', dataType: 'map', belongTo: '退保微服务' },
          { id: 'ww', serviceName: '承保前置校验', status: '1', callType: 'feign', dataType: 'map', belongTo: '承保微服务' },
          { id: 'zhaos', serviceName: '出单前置校验', status: '2', callType: 'feign', dataType: 'map', belongTo: '出单微服务' },
          { id: 'ls', serviceName: '退保前置校验', status: '1', callType: 'feign', dataType: 'map', belongTo: '退保微服务' },
          { id: 'ww', serviceName: '承保前置校验', status: '1', callType: 'feign', dataType: 'map', belongTo: '承保微服务' }
        ]
      }
    }
  },
  // {
  //   url: '/service/createService',
  //   type: 'post',
  //   response: config => {
  //     return {
  //       code: 200,
  //       data: {id: 'ls', serviceName: '出单', status: '1', callType: 'feign', dataType: 'xml', belongTo: '出单微服务'}
  //     }
  //   }
  // },

  {
    url: '/service/createService',
    type: 'post',
    response: config => {
      console.log('到达mock——createService')
      return {
        code: 200,
        data: {
          message: '新增成功'
        }
      }
    }

  },

  {
    url: '/service/getDropDownBoxValue',
    type: 'get',
    response: config => {
      console.log('到达mock——getDropDownBoxValue')
      return {
        code: 200,
        data: {
          status: [{
            key: '1',
            display_name: 'state'
          }, {
            key: '2',
            display_name: 'state2'
          }],
          application: [{
            key: '1',
            display_name: 'application'
          }, {
            key: '2',
            display_name: 'application2'
          }],
          callType: [{
            key: '1',
            display_name: 'callType'
          }, {
            key: '2',
            display_name: 'callType2'
          }],
          returnType: [{
            key: '1',
            display_name: 'returnType'
          }, {
            key: '2',
            display_name: 'returnType2'
          }]
        }
      }
    }
  }
]
