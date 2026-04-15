## 프로젝트 개요
 
본 프로젝트는 공공데이터포털의 기상청 단기예보 API를 활용하여,   
현재 위치와 사용자가 선택한 지역의 날씨 정보를 제공하는 웹 애플리케이션입니다.

홈에서는 현재 위치의 날씨 요약, 시간대별 예보, 즐겨찾기 미리보기를 제공하고,   
지역 페이지에서는 특정 지역의 날씨 정보를 확인하고 즐겨찾기에 추가, 삭제할 수 있습니다.

## 실행 방법

### 환경 변수 설정

공공데이터포털 API 호출을 위해 아래 환경 변수가 필요합니다.

프로젝트 루트에 `.env` 파일을 만들고 값을 채워야합니다.

```bash
VITE_DATA_GO_KR_BASE_URL=...
VITE_DATA_GO_KR_API_KEY=...
```

### 개발 서버 실행

```bash
npm install
npm run dev
```

- **로컬 주소**: [http://localhost:5173](http://localhost:5173)
- **배포 주소**: [https://weather-snowy-six-98.vercel.app/](https://weather-snowy-six-98.vercel.app/)

### 프로덕션 빌드, 미리보기

```bash
npm run build
npm run preview
```

</br>

## 기능 구현

### 1. 현재 위치 기반 날씨 조회

- 브라우저의 Geolocation 권한 요청 없이, `ipinfo.io`를 통해 IP 기반 위치
를 가져옵니다.
- 위경도를 공공데이터포털의 격자 좌표(`nx`, `ny`)로 변환한 뒤 단기예보를 조회합니다.
  
  - 장점: 권한 팝업이 없어 진입 장벽이 낮습니다.
  - 한계: 정확도가 제한적이며, 한국 외 지역에서는 격자 변환과 예보 조회가 실패할 수 있습니다.

### 2. 시간대별 날씨
<img width="500" height="532" alt="Image" src="https://github.com/user-attachments/assets/2fcc2d7d-21ea-4cd1-8584-99297fff07cf" />

- 현재 시각을 기준으로 다음 날까지의 시간대별 날씨를 제공합니다.

  - 다음 버튼 클릭 시 이후 시간대의 날씨를 표시합니다.
  - 이전 버튼 클릭 시 이전 시간대의 날씨를 표시합니다.
- 슬라이드 방식으로 구성되어 사용자 경험을 향상시켰습니다.

### 3. 지역 검색 및 이동
<img width="500" height="635" alt="Image" src="https://github.com/user-attachments/assets/f98b483b-d673-439d-815f-3d70ac2f0ab1" />

- 상단 검색창에서 지역을 검색하면 연관 리스트가 나타나고, 선택 시 지역 페이지로 이동합니다.
- 검색 성능 및 UX를 위해:

  - 공백, 하이픈을 제거해 비교하는 `normalizeSearchQuery`를 적용
  - 공유 JSON([src/shared/assets/korea_regions_with_grid.json](src/shared/assets/korea_regions_with_grid.json))에
    `searchKey`를 사전 계산해서 포함
    
    - 입력마다 문자열 정규화/조합을 반복하지 않도록 비용을 줄였습니다.
  - 초성 검색(예: `ㅅㅇ` → `서울`)을 지원
  - 키보드 사용자를 위해 `Tab` 혹은 키보드 방향키를 통해 선택 가능

### 4. 지역 페이지
<img width="500" height="635" alt="Image" src="https://github.com/user-attachments/assets/c935ffe9-e414-41e5-96ad-1297d605e0cf" />

- 지역 페이지에서 즐겨찾기 추가, 삭제가 가능합니다.
- 즐겨찾기는 최대 6개로 제한합니다.

### 5. 즐겨찾기 카드
<img width="500" height="413" alt="Image" src="https://github.com/user-attachments/assets/c866ed7c-672a-42bf-881d-2faa2ad59103" />

- 즐겨찾기 목록에서 별칭을 수정하거나 카드를 삭제할 수 있습니다.
- 각 즐겨찾기 카드에 해당 지역의 날씨(현재 온도, 최저 온도, 최고 온도)를 표시합니다.

### 6. 반응형 UI
<img width="500" height="333" alt="Image" src="https://github.com/user-attachments/assets/e6b630c4-4ab7-4435-bd55-25c1d4111f88" />

- 데스크탑과 모바일 뷰 모두에서 사용할 수 있도록 레이아웃을 반응형으로 구성했습니다.
  - TailwindCSS 유틸리티 기반으로 여백, 정렬, 타이포를 일관되게 유지했습니다.

</br>

## 접근성 및 UX

 키보드 조작 지원
 
  * 즐겨찾기 카드는 `role="button"`, `tabIndex`로 포커스 가능하며, Enter/Space로 이동 동작을 제공합니다.
  * 지역 검색은 키보드 방향키로 연관 항목 이동, Enter로 선택, Escape로 닫기 등 키보드 플로우를 제공합니다.
* 스크린리더 친화 속성

  * 로딩, 오류는 `aria-label`, `role="alert"` 등을 활용해 상태를 전달합니다.
  * 추천 리스트는 `aria-selected`로 현재 선택 상태를 표현합니다.
* 의도치 않은 포커스 이탈, 이동 방지
  * 카드 내부 입력, 버튼 클릭 시 이벤트 전파를 제어해, 편집 중에 카드 네비게이션이 실행되지 않도록 했습니다.
 
</br>

## 로딩 처리 및 데이터 패칭 전략
<img width="500" height="1016" alt="Image" src="https://github.com/user-attachments/assets/f0336692-7a95-4b94-bf6b-30aba206cc7b" />

### 1. 페이지 단위 Suspense 로딩

* 홈, 지역 주요 데이터는 TanStack Query의 `useSuspenseQuery`를 사용합니다.
* React `Suspense`의 fallback으로 로딩 UI를 선언적으로 분리했습니다.

### 2. 깜빡임 방지: DeferredSpinner

* 짧은 응답에서 스피너가 순간적으로 나타나는 깜빡임을 줄이기 위해
  `DeferredSpinner`를 사용해 300ms 지연 후에만 스피너를 표시합니다.

### 3. 즐겨찾기 카드 워터폴 완화

- 즐겨찾기 섹션은 카드 단위로 `Suspense` 경계를 두어,
  일부 카드가 느려도 전체 UI가 함께 막히지 않도록 구성했습니다.

</br>

## 에러 처리 설계

### 1. 잘못된 경로 처리
<img width="500" height="176" alt="image" src="https://github.com/user-attachments/assets/312adde4-5c47-493e-bd6f-27a215b92246" />

- 정의되지 않은 경로 접근 시 `path="*"`로 `NotFound` 페이지를 노출합니다.
- `NotFound`에서는 메인으로 돌아갈 수 있는 액션 버튼을 제공해 흐름을 끊지 않도록 했습니다.

### 2. “HTTP 200이지만 실패" 케이스 대응

* 공공데이터포털 API는 HTTP 상태코드가 200이어도,
  응답 본문 `header.resultCode`로 성공/실패가 결정되는 케이스가 있습니다.
* 이를 통일된 방식으로 처리하기 위해 [src/shared/api/publicDataClient.ts](src/shared/api/publicDataClient.ts)의
  axios interceptor에서:
  
  * `resultCode !== '00'`이면 `resultMsg`를 포함해 에러 발생시킴
  * 응답 구조가 예상과 다르면 에러 발생시킴

### 3. 런타임/데이터 패칭 에러 처리
<img width="500" height="847" alt="Image" src="https://github.com/user-attachments/assets/122aeb74-b668-4afa-a9e5-e892389e61ce" />

* 페이지 단위 `ErrorBoundary` + `QueryErrorResetBoundary` 조합으로
  데이터 패칭 에러를 화면 레벨에서 일관되게 처리합니다.
* 에러 화면에는 "다시 시도" 버튼을 제공하고,
  클릭 시 ErrorBoundary 상태 초기화와 실패한 쿼리 재시도를 유도합니다.
  
  - 에러가 났을 때 흰 색 화면이 아니라, 사용자가 스스로 복구를 시도할 수 있는 흐름을 우선했습니다.


</br>

## 기술 스택

```txt
react
react-router
@tanstack/react-query
axios
tailwindcss
vite
typescript
eslint / prettier
```

### TanStack Query

서버 상태(예보 데이터)의 캐싱/재시도/동기화를 단순화하기 위해 사용했습니다.
또한 `useSuspenseQuery`로 로딩과 성공 UI를 명확히 분리했습니다.

### React Router

홈, 지역, NotFound 라우팅을 명확하게 분리하고, 잘못된 경로는 NotFound로 안내했습니다.

### Axios

HTTP 클라이언트로 사용하며, 공공데이터포털 특성(HTTP 200이어도 실패 가능)을
interceptor에서 일관되게 처리하도록 구성했습니다.

### TailwindCSS

공통 디자인 토큰을 유틸리티로 일관되게 적용하고, 반응형 레이아웃을 간결하게 구성했습니다.

</br>

## 로컬스토리지 사용 이유

* 즐겨찾기는 로그인/백엔드 저장소가 없는 과제 환경에서
  새로고침 이후에도 상태가 유지되어야 하므로 localStorage를 사용했습니다.
* 저장 개수 제한(최대 6개)과 잘못된 데이터 복구를 포함해 방어적으로 처리했습니다.
* `storage` 이벤트를 구독해, 여러 탭에서 즐겨찾기 변경 시 상태가 동기화되도록 구성했습니다.

</br>

## 폴더 구조

```txt
src/
	main.tsx
	app/                # 앱 초기화/라우터/전역 Provider
	pages/              # 라우트 단위 페이지(Home/Region/NotFound)
	widgets/            # 페이지를 구성하는 큰 단위 UI(요약/시간대/즐겨찾기 섹션)
	features/           # 사용자 액션 단위 기능(지역 검색)
	entities/           # 도메인(지역/날씨/즐겨찾기) 모델/로직
	shared/             # 공용 UI/유틸/API 클라이언트/정적 자원
```

- `pages → widgets → features/entities → shared` 계층으로 의존 방향을 단순화했습니다.
- 도메인 로직(검색, 좌표 변환, 예보 파싱)은 `entities`에 모아 UI와 분리했습니다.
