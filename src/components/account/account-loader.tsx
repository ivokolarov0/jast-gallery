import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 280 440"
    speed={1}
    backgroundColor={'var(--c-border)'}
    foregroundColor={'var(--c-blue)'}
  >
    <rect x="0" y="0" rx="0" ry="0" width="280" height="400" />
    <rect x="0" y="410" rx="5" ry="5" width="280" height="7" />
    <rect x="0" y="425" rx="5" ry="5" width="280" height="7" />
  </ContentLoader>
)

const AccountLoader = () => {
  const items = Array.from({ length: 20 }, (_, index) => <Loader key={index} />);
  return (
    <>
      <ContentLoader
        speed={1}
        backgroundColor={'var(--c-border)'}
        foregroundColor={'var(--c-blue)'}
        width={'100%'}
        height={61}
        className="search-form"
      >
        <rect x="0" y="0" rx="0" ry="0" width="100%" height="61" />
      </ContentLoader>
      <ul className="games-list">
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </>
  )
}

export default AccountLoader