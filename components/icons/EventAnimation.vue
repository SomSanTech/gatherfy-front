<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <rect width="16" height="16" x="4" y="4" stroke-dasharray="64" rx="1">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.7s"
          dur="0.5s"
          values="0;64"
        ></animate>
      </rect>
      <path stroke-dasharray="6" d="M7 4V2M17 4V2">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.5s"
          dur="0.2s"
          values="0;6"
        ></animate>
      </path>
      <path stroke-dasharray="12" d="M7 11H17">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.2s"
          dur="0.2s"
          values="0;12"
        ></animate>
      </path>
      <path stroke-dasharray="9" d="M7 15H14">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.2s"
          values="0;9"
        ></animate>
      </path>
    </g>
    <rect width="14" height="3" x="5" y="5" fill="currentColor">
      <animate
        fill="freeze"
        attributeName="height"
        begin="0.5s"
        dur="0.2s"
        values="3;0"
      ></animate>
    </rect>
  </svg>
</template>

<script>
export default {
  name: 'LineMdCalendarOut',
};
</script>
