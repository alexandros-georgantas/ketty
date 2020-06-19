import React from 'react'
import { ButtonWithIcon } from './Button'

const MetadataButton = ({ onMetadataAdd }) => {
  const icon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Common/Icon/metData">
        <rect width="28" height="28" fill="white" />
        <g id="Common/Icon-background">
          <rect width="28" height="28" fill="white" />
        </g>
        <g id="Group 3">
          <g id="Group 2.3">
            <g id="Group">
              <g id="Vector">
                <mask
                  id="path-1-outside-1"
                  maskUnits="userSpaceOnUse"
                  x="5"
                  y="13.8421"
                  width="18"
                  height="10"
                  fill="black"
                >
                  <rect fill="white" x="5" y="13.8421" width="18" height="10" />
                  <path d="M14 22C18.4183 22 22 21.0574 22 19.8947V16.9474C22 15.7847 18.4183 14.8421 14 14.8421C9.58172 14.8421 6 15.7847 6 16.9474V19.8947C6 21.0574 9.58172 22 14 22Z" />
                </mask>
                <path
                  d="M14 22C18.4183 22 22 21.0574 22 19.8947V16.9474C22 15.7847 18.4183 14.8421 14 14.8421C9.58172 14.8421 6 15.7847 6 16.9474V19.8947C6 21.0574 9.58172 22 14 22Z"
                  fill="white"
                />
                <path
                  d="M21 19.8947C21 19.6386 21.1804 19.6552 20.843 19.8651C20.5589 20.0419 20.0813 20.2376 19.4024 20.4163C18.0593 20.7697 16.1488 21 14 21V23C16.2694 23 18.359 22.759 19.9113 22.3505C20.6801 22.1481 21.3741 21.8902 21.8996 21.5633C22.3718 21.2694 23 20.7322 23 19.8947H21ZM14 21C11.8512 21 9.94073 20.7697 8.59764 20.4163C7.91869 20.2376 7.44107 20.0419 7.15695 19.8651C6.81956 19.6552 7 19.6386 7 19.8947H5C5 20.7322 5.62815 21.2694 6.10041 21.5633C6.62593 21.8902 7.31989 22.1481 8.08865 22.3505C9.641 22.759 11.7306 23 14 23V21ZM7 16.9474C7 17.2035 6.81956 17.1869 7.15695 16.977C7.44107 16.8002 7.91869 16.6045 8.59764 16.4258C9.94073 16.0723 11.8512 15.8421 14 15.8421V13.8421C11.7306 13.8421 9.641 14.0831 8.08865 14.4916C7.31989 14.694 6.62593 14.9519 6.10041 15.2788C5.62815 15.5727 5 16.1099 5 16.9474H7ZM14 15.8421C16.1488 15.8421 18.0593 16.0723 19.4024 16.4258C20.0813 16.6045 20.5589 16.8002 20.843 16.977C21.1804 17.1869 21 17.2035 21 16.9474H23C23 16.1099 22.3718 15.5727 21.8996 15.2788C21.3741 14.9519 20.6801 14.694 19.9113 14.4916C18.359 14.0831 16.2694 13.8421 14 13.8421V15.8421ZM5 16.9474V19.8947H7V16.9474H5ZM23 19.8947V16.9474H21V19.8947H23Z"
                  fill="#828282"
                  mask="url(#path-1-outside-1)"
                />
              </g>
            </g>
            <path
              id="Ellipse"
              d="M14 19.5526C16.2393 19.5526 18.2841 19.3143 19.7841 18.9195C20.5304 18.7232 21.1703 18.4808 21.6355 18.1914C22.074 17.9185 22.5 17.5114 22.5 16.9474C22.5 16.3833 22.074 15.9762 21.6355 15.7034C21.1703 15.4139 20.5304 15.1716 19.7841 14.9752C18.2841 14.5804 16.2393 14.3421 14 14.3421C11.7607 14.3421 9.71593 14.5804 8.2159 14.9752C7.46959 15.1716 6.82972 15.4139 6.36454 15.7034C5.92601 15.9762 5.5 16.3833 5.5 16.9474C5.5 17.5114 5.92601 17.9185 6.36454 18.1914C6.82972 18.4808 7.46959 18.7232 8.2159 18.9195C9.71593 19.3143 11.7607 19.5526 14 19.5526Z"
              fill="white"
              stroke="#828282"
            />
          </g>
          <g id="Group 2.2">
            <g id="Group_2">
              <g id="Vector_2">
                <mask
                  id="path-4-outside-2"
                  maskUnits="userSpaceOnUse"
                  x="5"
                  y="10.8947"
                  width="18"
                  height="10"
                  fill="black"
                >
                  <rect fill="white" x="5" y="10.8947" width="18" height="10" />
                  <path d="M14 19.0526C18.4183 19.0526 22 18.1101 22 16.9474V14C22 12.8373 18.4183 11.8947 14 11.8947C9.58172 11.8947 6 12.8373 6 14V16.9474C6 18.1101 9.58172 19.0526 14 19.0526Z" />
                </mask>
                <path
                  d="M14 19.0526C18.4183 19.0526 22 18.1101 22 16.9474V14C22 12.8373 18.4183 11.8947 14 11.8947C9.58172 11.8947 6 12.8373 6 14V16.9474C6 18.1101 9.58172 19.0526 14 19.0526Z"
                  fill="white"
                />
                <path
                  d="M21 16.9474C21 16.6913 21.1804 16.7078 20.843 16.9177C20.5589 17.0945 20.0813 17.2903 19.4024 17.4689C18.0593 17.8224 16.1488 18.0526 14 18.0526V20.0526C16.2694 20.0526 18.359 19.8116 19.9113 19.4031C20.6801 19.2008 21.3741 18.9429 21.8996 18.6159C22.3718 18.3221 23 17.7848 23 16.9474H21ZM14 18.0526C11.8512 18.0526 9.94073 17.8224 8.59764 17.4689C7.91869 17.2903 7.44107 17.0945 7.15695 16.9177C6.81956 16.7078 7 16.6913 7 16.9474H5C5 17.7848 5.62815 18.3221 6.10041 18.6159C6.62593 18.9429 7.31989 19.2008 8.08865 19.4031C9.641 19.8116 11.7306 20.0526 14 20.0526V18.0526ZM7 14C7 14.2561 6.81956 14.2395 7.15695 14.0296C7.44107 13.8528 7.91869 13.6571 8.59764 13.4784C9.94073 13.125 11.8512 12.8947 14 12.8947V10.8947C11.7306 10.8947 9.641 11.1358 8.08865 11.5443C7.31989 11.7466 6.62593 12.0045 6.10041 12.3315C5.62815 12.6253 5 13.1625 5 14H7ZM14 12.8947C16.1488 12.8947 18.0593 13.125 19.4024 13.4784C20.0813 13.6571 20.5589 13.8528 20.843 14.0296C21.1804 14.2395 21 14.2561 21 14H23C23 13.1625 22.3718 12.6253 21.8996 12.3315C21.3741 12.0045 20.6801 11.7466 19.9113 11.5443C18.359 11.1358 16.2694 10.8947 14 10.8947V12.8947ZM5 14V16.9474H7V14H5ZM23 16.9474V14H21V16.9474H23Z"
                  fill="#828282"
                  mask="url(#path-4-outside-2)"
                />
              </g>
            </g>
            <path
              id="Ellipse_2"
              d="M14 16.6053C16.2393 16.6053 18.2841 16.3669 19.7841 15.9722C20.5304 15.7758 21.1703 15.5334 21.6355 15.244C22.074 14.9711 22.5 14.5641 22.5 14C22.5 13.4359 22.074 13.0288 21.6355 12.756C21.1703 12.4666 20.5304 12.2242 19.7841 12.0278C18.2841 11.6331 16.2393 11.3947 14 11.3947C11.7607 11.3947 9.71593 11.6331 8.2159 12.0278C7.46959 12.2242 6.82972 12.4666 6.36454 12.756C5.92601 13.0288 5.5 13.4359 5.5 14C5.5 14.5641 5.92601 14.9711 6.36454 15.244C6.82972 15.5334 7.46959 15.7758 8.2159 15.9722C9.71593 16.3669 11.7607 16.6053 14 16.6053Z"
              fill="white"
              stroke="#828282"
            />
          </g>
          <g id="Group 2.1">
            <g id="Group_3">
              <g id="Vector_3">
                <mask
                  id="path-7-outside-3"
                  maskUnits="userSpaceOnUse"
                  x="5"
                  y="7.94737"
                  width="18"
                  height="10"
                  fill="black"
                >
                  <rect fill="white" x="5" y="7.94737" width="18" height="10" />
                  <path d="M14 16.1053C18.4183 16.1053 22 15.1627 22 14V11.0526C22 9.88993 18.4183 8.94737 14 8.94737C9.58172 8.94737 6 9.88993 6 11.0526V14C6 15.1627 9.58172 16.1053 14 16.1053Z" />
                </mask>
                <path
                  d="M14 16.1053C18.4183 16.1053 22 15.1627 22 14V11.0526C22 9.88993 18.4183 8.94737 14 8.94737C9.58172 8.94737 6 9.88993 6 11.0526V14C6 15.1627 9.58172 16.1053 14 16.1053Z"
                  fill="white"
                />
                <path
                  d="M21 14C21 13.7439 21.1804 13.7605 20.843 13.9704C20.5589 14.1472 20.0813 14.3429 19.4024 14.5216C18.0593 14.875 16.1488 15.1053 14 15.1053V17.1053C16.2694 17.1053 18.359 16.8642 19.9113 16.4557C20.6801 16.2534 21.3741 15.9955 21.8996 15.6685C22.3718 15.3747 23 14.8375 23 14H21ZM14 15.1053C11.8512 15.1053 9.94073 14.875 8.59764 14.5216C7.91869 14.3429 7.44107 14.1472 7.15695 13.9704C6.81956 13.7605 7 13.7439 7 14H5C5 14.8375 5.62815 15.3747 6.10041 15.6685C6.62593 15.9955 7.31989 16.2534 8.08865 16.4557C9.641 16.8642 11.7306 17.1053 14 17.1053V15.1053ZM7 11.0526C7 11.3087 6.81956 11.2922 7.15695 11.0822C7.44107 10.9055 7.91869 10.7097 8.59764 10.5311C9.94073 10.1776 11.8512 9.94737 14 9.94737V7.94737C11.7306 7.94737 9.641 8.1884 8.08865 8.59692C7.31989 8.79922 6.62593 9.05713 6.10041 9.3841C5.62815 9.67792 5 10.2152 5 11.0526H7ZM14 9.94737C16.1488 9.94737 18.0593 10.1776 19.4024 10.5311C20.0813 10.7097 20.5589 10.9055 20.843 11.0822C21.1804 11.2922 21 11.3087 21 11.0526H23C23 10.2152 22.3718 9.67792 21.8996 9.3841C21.3741 9.05713 20.6801 8.79922 19.9113 8.59692C18.359 8.1884 16.2694 7.94737 14 7.94737V9.94737ZM5 11.0526V14H7V11.0526H5ZM23 14V11.0526H21V14H23Z"
                  fill="#828282"
                  mask="url(#path-7-outside-3)"
                />
              </g>
            </g>
            <path
              id="Ellipse_3"
              d="M14 13.6579C16.2393 13.6579 18.2841 13.4196 19.7841 13.0248C20.5304 12.8284 21.1703 12.5861 21.6355 12.2966C22.074 12.0238 22.5 11.6167 22.5 11.0526C22.5 10.4886 22.074 10.0815 21.6355 9.80863C21.1703 9.51922 20.5304 9.27685 19.7841 9.08045C18.2841 8.68571 16.2393 8.44737 14 8.44737C11.7607 8.44737 9.71593 8.68571 8.2159 9.08045C7.46959 9.27685 6.82972 9.51922 6.36454 9.80863C5.92601 10.0815 5.5 10.4886 5.5 11.0526C5.5 11.6167 5.92601 12.0238 6.36454 12.2966C6.82972 12.5861 7.46959 12.8284 8.2159 13.0248C9.71593 13.4196 11.7607 13.6579 14 13.6579Z"
              fill="white"
              stroke="#828282"
            />
          </g>
          <g id="Group 2">
            <g id="Group_4">
              <g id="Vector_4">
                <mask
                  id="path-10-outside-4"
                  maskUnits="userSpaceOnUse"
                  x="5"
                  y="5"
                  width="18"
                  height="10"
                  fill="black"
                >
                  <rect fill="white" x="5" y="5" width="18" height="10" />
                  <path d="M14 13.1579C18.4183 13.1579 22 12.2153 22 11.0526V8.10526C22 6.94256 18.4183 6 14 6C9.58172 6 6 6.94256 6 8.10526V11.0526C6 12.2153 9.58172 13.1579 14 13.1579Z" />
                </mask>
                <path
                  d="M14 13.1579C18.4183 13.1579 22 12.2153 22 11.0526V8.10526C22 6.94256 18.4183 6 14 6C9.58172 6 6 6.94256 6 8.10526V11.0526C6 12.2153 9.58172 13.1579 14 13.1579Z"
                  fill="white"
                />
                <path
                  d="M21 11.0526C21 10.7965 21.1804 10.8131 20.843 11.023C20.5589 11.1998 20.0813 11.3955 19.4024 11.5742C18.0593 11.9276 16.1488 12.1579 14 12.1579V14.1579C16.2694 14.1579 18.359 13.9169 19.9113 13.5084C20.6801 13.306 21.3741 13.0481 21.8996 12.7212C22.3718 12.4273 23 11.8901 23 11.0526H21ZM14 12.1579C11.8512 12.1579 9.94073 11.9276 8.59764 11.5742C7.91869 11.3955 7.44107 11.1998 7.15695 11.023C6.81956 10.8131 7 10.7965 7 11.0526H5C5 11.8901 5.62815 12.4273 6.10041 12.7212C6.62593 13.0481 7.31989 13.306 8.08865 13.5084C9.641 13.9169 11.7306 14.1579 14 14.1579V12.1579ZM7 8.10526C7 8.36137 6.81956 8.34479 7.15695 8.13487C7.44107 7.9581 7.91869 7.76236 8.59764 7.58369C9.94073 7.23025 11.8512 7 14 7V5C11.7306 5 9.641 5.24103 8.08865 5.64954C7.31989 5.85185 6.62593 6.10976 6.10041 6.43673C5.62815 6.73055 5 7.2678 5 8.10526H7ZM14 7C16.1488 7 18.0593 7.23025 19.4024 7.58369C20.0813 7.76236 20.5589 7.9581 20.843 8.13487C21.1804 8.34479 21 8.36137 21 8.10526H23C23 7.2678 22.3718 6.73055 21.8996 6.43673C21.3741 6.10976 20.6801 5.85185 19.9113 5.64954C18.359 5.24103 16.2694 5 14 5V7ZM5 8.10526V11.0526H7V8.10526H5ZM23 11.0526V8.10526H21V11.0526H23Z"
                  fill="#828282"
                  mask="url(#path-10-outside-4)"
                />
              </g>
            </g>
            <path
              id="Ellipse_4"
              d="M14 10.7105C16.2393 10.7105 18.2841 10.4722 19.7841 10.0774C20.5304 9.88105 21.1703 9.63868 21.6355 9.34926C22.074 9.07642 22.5 8.66933 22.5 8.10526C22.5 7.54119 22.074 7.13411 21.6355 6.86126C21.1703 6.57184 20.5304 6.32948 19.7841 6.13308C18.2841 5.73834 16.2393 5.5 14 5.5C11.7607 5.5 9.71593 5.73834 8.2159 6.13308C7.46959 6.32948 6.82972 6.57184 6.36454 6.86126C5.92601 7.13411 5.5 7.54119 5.5 8.10526C5.5 8.66933 5.92601 9.07642 6.36454 9.34926C6.82972 9.63868 7.46959 9.88105 8.2159 10.0774C9.71593 10.4722 11.7607 10.7105 14 10.7105Z"
              fill="white"
              stroke="#828282"
            />
          </g>
        </g>
      </g>
    </svg>
  )

  return (
    <React.Fragment>
      <ButtonWithIcon icon={icon} label="Metadata" onClick={onMetadataAdd} />
    </React.Fragment>
  )
}

export default MetadataButton
