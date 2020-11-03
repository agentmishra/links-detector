import React, { CSSProperties } from 'react';
import { DetectedLink } from '../../hooks/useLinksDetector';
import Icon from '../shared/Icon';
import { ICON_KEYS } from '../../icons';
import { DETECTION_BACKGROUND_COLOR, DETECTION_FOREGROUND_COLOR } from '../../constants/style';

type DetectedLinksProps = {
  links: DetectedLink[],
  containerSize: number,
};

function DetectedLinks(props: DetectedLinksProps): React.ReactElement | null {
  const { links, containerSize } = props;

  if (!links || !links.length) {
    return null;
  }

  const containerStyle: CSSProperties = {
    width: `${containerSize}px`,
    height: `${containerSize}px`,
  };

  const linkStyle: CSSProperties = {
    backgroundColor: DETECTION_BACKGROUND_COLOR,
    color: DETECTION_FOREGROUND_COLOR,
    fontSize: '12px',
  };

  const linksElements = links.map((link: DetectedLink) => {
    const linkContainerStyle: CSSProperties = {
      marginTop: `${link.y1}px`,
      marginLeft: `${link.x1}px`,
    };

    return (
      <div key={link.url} style={linkContainerStyle} className="absolute block overflow-hidden">
        <a href={link.url} style={linkStyle} className="flex flex-row items-start rounded justify-center pt-2 pb-2 pl-3 pr-3 font-bold">
          <Icon iconKey={ICON_KEYS.LINK} className="w-4 h-4 mr-2" />
          <span>{link.url}</span>
        </a>
      </div>
    );
  });

  return (
    <div style={containerStyle} className="block overflow-hidden">
      { linksElements }
    </div>
  );
}

export default DetectedLinks;
