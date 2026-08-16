import React from 'react';
import { AAMCProject } from '../../types';
import { NewHeader, NewHeaderProps } from './NewHeader';

export type HeaderProps = NewHeaderProps;

export const Header: React.FC<HeaderProps> = (props) => {
  return <NewHeader {...props} />;
};

export default Header;

