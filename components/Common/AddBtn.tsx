import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

interface AddBtnProps {
  href: string;
  size: number;
}

const BtnWrp = styled.div`
  width: ${({ size }: { size: number }) => size + 'px'};
  height: ${({ size }: { size: number }) => size + 'px'};
  border-radius: ${({ size }: { size: number }) => size + 'px'};
  box-shadow: -3px -3px 7px #ffffff, 3px 3px 7px rgba(136, 165, 191, 0.48);
  position: relative;
  & a {
    font-size: ${({ size }: { size: number }) => size + 'px'};
    position: absolute;
    left: 50%;
    top: 46%;
    transform: translateX(-50%) translateY(-50%);
    line-height: ${({ size }: { size: number }) => size + 'px'};
  }

  @media screen and (max-width: 900px) {
    width: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
    height: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
    border-radius: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
    margin-bottom: 20px;
    margin-right: 20px;

    & a {
      font-size: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
      line-height: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
    }
  }
`;

const AddBtn: React.FC<AddBtnProps> = ({ href, size }) => {
  return (
    <BtnWrp className="add-btn" size={size}>
      <Link href={href}>+</Link>
    </BtnWrp>
  );
};

export default AddBtn;
