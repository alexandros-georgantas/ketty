
import React, { useState} from 'react'
import 'flag-icon-css/css/flag-icon.min.css'
import cookies from 'js-cookie'
import styled from 'styled-components'
import {Trans} from "react-i18next";
import PropTypes from "prop-types";
import { supportedLanguages } from '../../../config/i18n'
import i18n from "../../../services/i18n";


const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 5px;
  cursor: pointer;
  border: none;
  min-width: 50px;
  top: 100%;
  left: 0;
`;

const IoGlobeOutline = () => (
    <svg
        fill="#0B65CB"
        height='15'
        viewBox="0 0 16 16"
        width='21'
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
    </svg>
)

const GlobeIcon = styled(IoGlobeOutline)`
  font-size: 1.5rem;
  color: #0B65CB;
  cursor: pointer;
  margin-right: 10px;
`

const CaretIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: #0B65CB;
  transition: transform 0.2s;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
  border: 0px 0px 0px 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  white-space: nowrap;
`;

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const FlagIcon = styled.span`
  margin-right: 5px;
  opacity: ${({ isActive }) => (isActive ? 0.5 : 1)};
`



const languages = supportedLanguages;

const LanguageSwitcher = (props) => {
    const {setIsOpen} = props
    const [isOpen, setIsOpenLS] = useState(false);

    const currentLanguageCode = cookies.get('i18next') || 'en'

    const toggleDropdown = () => {
        setIsOpenLS(!isOpen);

    };

    const selectLanguage = (language) => {
        setIsOpenLS(false);
        i18n.changeLanguage(language.code);
        // eslint-disable-next-line react/prop-types
        if (setIsOpen) setIsOpen(false)
    };

    const handleMouseLeave = () => {
        setIsOpenLS(false);
    };

    return (
        <DropdownWrapper onMouseLeave={handleMouseLeave}>
            <DropdownButton onClick={toggleDropdown}>
                <GlobeIcon viewBox="0 0 512 512">
                    <IoGlobeOutline />
                </GlobeIcon>
                {/* {selectedLanguage.name} */}
                <span>&nbsp;<Trans i18nKey="language">language</Trans></span>
                <CaretIcon isOpen={isOpen} viewBox="0 0 320 512">
                    <path
                        d="M288 192L160 320 32 192h256z"
                        fill="#0B65CB"
                     />
                </CaretIcon>
            </DropdownButton>
            {isOpen && (
                <DropdownList>
                    {languages.map((language) => (
                        <DropdownItem key={language.code} onClick={() => selectLanguage(language)}>
                            <FlagIcon
                                className={`flag-icon flag-icon-${language.code === 'en'? 'us' : language.code}`}
                                isActive={currentLanguageCode === language.code}
                            /> {language.name}
                        </DropdownItem>
                    ))}
                </DropdownList>
            )}
        </DropdownWrapper>
    );
};

LanguageSwitcher.propTypes = {
    setIsOpen: PropTypes.func,
}
LanguageSwitcher.defaultProps = {
    setIsOpen: null,
}
export default LanguageSwitcher
