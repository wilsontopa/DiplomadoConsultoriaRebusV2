import React from 'react';

interface HtmlContentProps {
  html: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ html }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default HtmlContent;
