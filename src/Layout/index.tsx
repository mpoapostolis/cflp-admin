import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import Header from '../components/Header';
import { container, header, main } from './css';
import { cx } from 'emotion';
import { useMediaQuery, Theme } from '@material-ui/core';

function Layout() {
  const isSmallDevice = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(!isSmallDevice);

  useEffect(() => {
    setOpen(!isSmallDevice);
  }, [isSmallDevice]);

  return (
    <div className={cx(container, { isSmallDevice })}>
      <header className={header}>
        <Header setOpen={() => setOpen(!open)} />
      </header>
      <div>
        <Menu isSmallDevice={isSmallDevice} open={open} setOpen={() => setOpen(false)} />
      </div>
      <main className={main}></main>
    </div>
  );
}
export default Layout;
