import React from 'react';
import styled from 'styled-components';

export const Loader = ({ isLoading }) => {
  return (
    <FullScreenWrapper isLoading={isLoading}>
      <StyledWrapper>
        <div className="loader" />
      </StyledWrapper>
    </FullScreenWrapper>
  );
};

const FullScreenWrapper = styled.div`
  position: fixed;
  top: ${({ isLoading }) =>
    isLoading ? "0px" : "-100vh"};
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background, #ffffff);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition: 1s ease;
  opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};
  transform: ${({ isLoading }) =>
    isLoading ? "translateY(0)" : "translateY(-20px)"};
  pointer-events: ${({ isLoading }) => (isLoading ? "auto" : "none")};
`;

export const StyledWrapper = styled.div`

  .loader {
    width: 48px;
    height: 48px;
    margin: auto;
    position: relative;
    
  }

  .loader:before {
    content: '';
    width: 48px;
    height: 5px;
    background: #f0808050;
    position: absolute;
    top: 60px;
    left: 0;
    border-radius: 50%;
    animation: shadow324 0.5s linear infinite;
  }

  .loader:after {
    content: '';
    width: 100%;
    height: 100%;
    background: var(--color-primary);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    animation: jump7456 0.5s linear infinite;
  }

  @keyframes jump7456 {
    15% { border-bottom-right-radius: 3px; }
    25% { transform: translateY(9px) rotate(22.5deg); }
    50% { transform: translateY(18px) scale(1, 0.9) rotate(45deg); border-bottom-right-radius: 40px; }
    75% { transform: translateY(9px) rotate(67.5deg); }
    100% { transform: translateY(0) rotate(90deg); }
  }

  @keyframes shadow324 {
    0%, 100% { transform: scale(1, 1); }
    50% { transform: scale(1.2, 1); }
  }
`;

export default Loader;
