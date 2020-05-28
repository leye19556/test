# CoinAT-Back

Express,MongoDB,JavaScript

### ToDo

- 코인 리스트 추가 및 제거 ✅
- 상장 코인 공지 ✅
- 시세알림 봇 실행 ✅
- 코인 리스트 관리 링크 및 기능 제공 ✅
- 코인 매수, 매도 (거래 진행 가능 하지만 수정 필요)

### mongodb collections

- coinModel

```
  name: {
    type: String,
    required: "name is required",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
```

- upbitNoticeModel

```
  title: {
    type: String,
    required: "title is required"
  },
  coin: {
    type: String,
    required: "coin is required"
  },
  link: {
    type: String,
    default: null
  },
  updatedAt: {
    type: String,
    required: "updatedAt is required"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
```

- binanceNoticeModel

```
  title: {
    type: String,
    required: "title is required"
  },
  coin: {
    type: String,
    required: "coin is required"
  },
  link: {
    type: String,
    required: "link is required"
  },
  checked: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: String,
    required: "updatedAt is required"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
```

### 설치

```
npm install
```

### 실행

```
npm run dev:server
npm run dev:assets
```
