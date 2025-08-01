import React from 'react';

interface HtmlContentProps {
  html: string;
  className?: string; // Añadimos className para pasar estilos desde el padre
}

const HtmlContent: React.FC<HtmlContentProps> = ({ html, className }) => {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default HtmlContent;
