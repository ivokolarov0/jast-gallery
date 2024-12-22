import ContentLoader from "react-content-loader";

const GameLoader = () => (
  <div className="game-entry">
    <div className="game-entry__top">
      <ContentLoader
        viewBox="0 0 199 53"
        width={199}
        height={53}
        speed={1}
        backgroundColor={'var(--c-border)'}
        foregroundColor={'var(--c-blue)'}
      >
        <rect x="0" y="0" rx="5" ry="5" width="199" height="53" />
      </ContentLoader>
      <ContentLoader
        viewBox="0 0 199 53"
        width={199}
        height={53}
        speed={1}
        backgroundColor={'var(--c-border)'}
        foregroundColor={'var(--c-blue)'}
      >
        <rect x="0" y="0" rx="5" ry="5" width="199" height="53" />
      </ContentLoader>
    </div>
    <div className="game-entry__header">
      <ContentLoader
        viewBox="0 0 2000 40"
        width={'100%'}
        height={40}
        speed={1}
        backgroundColor={'var(--c-border)'}
        foregroundColor={'var(--c-blue)'}
      >
        <rect x="0" y="0" rx="5" ry="5" width="2000" height="40" />
      </ContentLoader>
    </div>
    <div className="game-entry__inner">
      <div className="game-entry__col">
        <ContentLoader
          viewBox="0 0 1000 640"
          width={'100%'}
          speed={1}
          backgroundColor={'var(--c-border)'}
          foregroundColor={'var(--c-blue)'}
        >
          <rect x="0" y="0" rx="0" ry="0" width="100%" height="640" />
        </ContentLoader>
      </div>
      <div className="game-entry__col game-entry__col--right">
        <ContentLoader
          viewBox="0 0 370 640"
          width={'100%'}
          speed={1}
          backgroundColor={'var(--c-border)'}
          foregroundColor={'var(--c-blue)'}
        >
          <rect x="0" y="0" rx="0" ry="0" width="100%" height="640" />
        </ContentLoader>
      </div>
    </div>
  </div>
)

export default GameLoader;