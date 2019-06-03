/**
 * 路由通用类
 * author by kairry 2017年11月20日
 */
const Index = resolve => require(['@/views/index/Index'], resolve)
const IndexSingle = resolve => require(['@/views/IndexSingle/Index'], resolve)
const IndexTem = resolve => require(['@/views/indexTem/Index'], resolve)
const IndexWenk = resolve => require(['@/views/indexWenk/Index'], resolve)

const IndexMas = resolve => require(['@/views/indexMas/Index'], resolve)


const Detection = resolve => require(['@/views/detection/Index'], resolve)

const Auth = resolve => require(['@/views/auth/Auth'], resolve)
const Init = resolve => require(['@/views/init/Init'], resolve)
const Pay1 = resolve => require(['@/views/pay/Pay1'], resolve)
const Pay2 = resolve => require(['@/views/pay/Pay2'], resolve)


const TimingList = resolve => require(['@/views/timing/List'], resolve)
const TimingEdet = resolve => require(['@/views/timing/Edit'], resolve)
const Set = resolve => require(['@/views/set/Index'], resolve)
const DevInfo = resolve => require(['@/views/set/DevInfo'], resolve)
const MasterInfo = resolve => require(['@/views/set/MasterInfo'], resolve)
const Share = resolve => require(['@/views/set/Share'], resolve)
const Data = resolve => require(['@/views/set/Data'], resolve)
const Record = resolve => require(['@/views/set/Record'], resolve)

const AMap = resolve => require(['@/views/set/Map'], resolve)
const Battery = resolve => require(['@/views/set/Battery'], resolve)
const Config = resolve => require(['@/views/set/Config'], resolve)
const List = resolve => require(['@/views/list/Index'], resolve)
const Demo = resolve => require(['@/views/demo'], resolve)
const Permissions = resolve => require(['@/views/set/Permissions'], resolve)
const Group = resolve => require(['@/views/set/Group'], resolve)
const WenKongIndex = resolve => require(['@/views/wenkong/Index'], resolve)
const AirPurifier = resolve => require(['@/views/air-purifier'], resolve)
const KaiChe = resolve => require(['@/views/kaiche'], resolve)
const ReBengIndex = resolve => require(['@/views/rebeng/Index'], resolve)
const ControlDeviceIndex = resolve => require(['@/views/controlDevice/Index'], resolve)
const AirCoolIndex = resolve => require(['@/views/indexAirCool/Index'], resolve)


const TeamShare = resolve => require(['@/views/set/teamShare'], resolve)
const Ceshi = resolve => require(['@/views/set/ceshi'], resolve)
let routes = [
  {
    path: '*',
    redirect: '/init'
  },
  {
    path: '/auth',
    component: Auth,
    meta: {
      title: ''
    }
  },
  {
    path: '/teamShare',
    component: TeamShare,
    meta: {
      title: '设备组分享'
    }
  },
  {
    path: '/ceshi',
    component: Ceshi,
    meta: {
      title: ''
    }
  },
  {
    path: '/demo',
    component: Demo,
    meta: {
      title: ''
    }
  },
  {
    path: '/init',
    component: Init,
    meta: {
      title: ''
    }
  },
  {
    path: '/pay1',
    component: Pay1,
    meta: {
      title: ''
    }
  },
  {
    path: '/pay2',
    component: Pay2,
    meta: {
      title: ''
    }
  },
  {
    path: '/permissions',
    component: Permissions,
    meta: {
      title: ''
    }
  },
  {
    path: '/group',
    component: Group,
    meta: {
      title: ''
    }
  },
  {
    path: '/index',
    component: Index,
    meta: {
      title: ''
    }
  },
  {
    path: '/indexsingle',
    component: IndexSingle,
    meta: {
      title: ''
    }
  },
  {
    path: '/indextem',
    component: IndexTem,
    meta: {
      title: ''
    }
  },
  {
    path: '/indexwenk',
    component: IndexWenk,
    meta: {
      title: ''
    }
  },
  {
    path: '/indexmas',
    component: IndexMas,
    meta: {
      title: ''
    }
  },
  {
    path: '/detection',
    component: Detection,
    meta: {
      title: ''
    }
  },
  {
    path: '/timinglist',
    component: TimingList,
    meta: {
      title: ''
    }
  },
  {
    path: '/timingedet',
    component: TimingEdet,
    meta: {
      title: ''
    }
  },
  {
    path: '/set',
    component: Set,
    meta: {
      title: ''
    }
  },
  {
    path: '/devinfo',
    component: DevInfo,
    meta: {
      title: ''
    }
  },
  {
    path: '/masterinfo',
    component: MasterInfo,
    meta: {
      title: ''
    }
  },
  {
    path: '/share',
    component: Share,
    meta: {
      title: ''
    }
  },
  {
    path: '/data',
    component: Data,
    meta: {
      title: ''
    }
  },
  {
    path: '/record',
    component: Record,
    meta: {
      title: ''
    }
  },
  {
    path: '/map',
    component: AMap,
    meta: {
      title: ''
    }
  },
  {
    path: '/battery',
    component: Battery,
    meta: {
      title: ''
    }
  },
  {
    path: '/config',
    component: Config,
    meta: {
      title: ''
    }
  },
  {
    path: '/list',
    component: List,
    meta: {
      title: '设备列表'
    }
  },
  {
    path: '/air-purifier',
    component: AirPurifier,
    meta: {
      title: ''
    }
  },
  {
    path: '/wenkongindex',
    component: WenKongIndex,
    meta: {
      title: ''
    }
  },
  {
    path: '/kaiche',
    component: KaiChe
  },
  {
    path: '/rebengindex',
    component: ReBengIndex,
    meta: {
      title: ''
    }
  },
  {
    path: '/controldeviceindex',
    component: ControlDeviceIndex,
    meta: {
      title: ''
    }
  },
  {
    path: '/aircoolindex',
    component: AirCoolIndex,
    meta: {
      title: ''
    }
  }
]

export default routes
