<script setup lang="ts">
defineProps<{ scene: number; tile: number }>();
</script>
<template>
  <svg class="cg-mini-art" viewBox="0 0 160 110" aria-hidden="true">
    <g v-if="scene === 0 && tile === 0">
      <path
        class="art-grid"
        d="M10 25H150M10 50H150M10 75H150M35 10V100M80 10V100M125 10V100"
      />
      <path class="art-soft" d="M10 100V78L42 68L68 76L105 34L150 14V100Z" />
      <path class="art-line" d="M10 78L42 68L68 76L105 34L150 14" />
      <circle class="art-solid" cx="105" cy="34" r="8" />
      <circle class="art-paper" cx="105" cy="34" r="3" />
      <rect class="art-solid" x="12" y="14" width="51" height="19" rx="9" />
      <path class="art-light-line" d="M23 24H50" />
    </g>
    <g v-else-if="scene === 0 && tile === 1">
      <circle class="art-soft" cx="80" cy="55" r="45" />
      <path class="art-solid" d="M80 55V10A45 45 0 1 1 36 65Z" />
      <circle class="art-paper" cx="80" cy="55" r="26" />
      <path class="art-line" d="m68 55 9 9 18-21M122 22H149M12 90H43" />
      <circle class="art-solid" cx="145" cy="22" r="4" />
    </g>
    <g v-else-if="scene === 0 && tile === 2">
      <path class="art-line" d="M21 91V58Q21 43 37 43H121Q139 43 139 26V14" />
      <rect class="art-solid" x="8" y="72" width="29" height="25" rx="6" />
      <rect class="art-paper" x="66" y="29" width="29" height="28" rx="6" />
      <rect class="art-soft" x="121" y="5" width="31" height="25" rx="6" />
      <path class="art-light-line" d="m17 84 5 5 8-11" />
      <path class="art-line" d="M74 39H86M74 47H82m48-31 5 5 8-11" />
      <path class="art-grid" d="M50 83H145M50 93H116" />
    </g>
    <g v-else-if="scene === 0">
      <path class="art-grid" d="M10 100H151M10 70H151M10 40H151" />
      <rect class="art-soft" x="16" y="73" width="25" height="27" rx="3" />
      <rect class="art-soft" x="52" y="53" width="25" height="47" rx="3" />
      <rect class="art-solid" x="88" y="30" width="25" height="70" rx="3" />
      <rect class="art-solid" x="124" y="9" width="25" height="91" rx="3" />
      <path class="art-line" d="M17 47L67 11M50 11H67V28" />
    </g>
    <g v-else-if="scene === 1 && tile === 0">
      <rect class="art-paper" x="9" y="12" width="142" height="90" rx="6" />
      <path class="art-line" d="M9 29H151" />
      <circle class="art-solid" cx="19" cy="20" r="2" />
      <circle class="art-solid" cx="27" cy="20" r="2" />
      <rect class="art-solid" x="20" y="40" width="52" height="6" rx="2" />
      <rect class="art-soft" x="20" y="53" width="41" height="4" />
      <rect class="art-solid" x="20" y="70" width="36" height="14" rx="7" />
      <circle class="art-soft" cx="111" cy="65" r="26" />
      <path class="art-solid" d="m91 82 20-43 20 43Z" />
    </g>
    <g v-else-if="scene === 1 && tile === 1">
      <rect class="art-soft" x="14" y="18" width="61" height="36" rx="5" />
      <rect class="art-paper" x="84" y="18" width="61" height="36" rx="5" />
      <rect class="art-paper" x="14" y="63" width="61" height="36" rx="5" />
      <rect
        class="art-outline"
        x="84"
        y="63"
        width="61"
        height="36"
        rx="5"
        stroke-dasharray="4 4"
      />
      <path class="art-line" d="M106 81H123M114 73V89" />
      <path class="art-solid" d="m67 42 30 13-14 5-5 14Z" />
    </g>
    <g v-else-if="scene === 1 && tile === 2">
      <ellipse class="art-soft" cx="80" cy="91" rx="61" ry="12" />
      <path class="art-paper" d="M22 67V48H138V67L126 82H34Z" />
      <path class="art-solid" d="M65 59V34H45L80 3L115 34H95V59Z" />
      <path class="art-line" d="M43 66H117" />
      <circle class="art-solid" cx="124" cy="85" r="16" />
      <path class="art-light-line" d="m116 85 6 6 10-13" />
    </g>
    <g v-else-if="scene === 1">
      <path class="art-line" d="M42 60L112 22M42 60L117 89" />
      <circle class="art-paper" cx="38" cy="59" r="26" />
      <circle class="art-solid" cx="119" cy="21" r="18" />
      <circle class="art-soft" cx="121" cy="89" r="18" />
      <path class="art-line" d="m27 59 8 8 16-20" />
      <path class="art-light-line" d="M112 21H126M119 14V28" />
    </g>
    <g v-else-if="tile === 0">
      <rect
        class="art-soft"
        x="40"
        y="8"
        width="82"
        height="83"
        rx="5"
        transform="rotate(10 80 50)"
      />
      <rect
        class="art-paper"
        x="25"
        y="15"
        width="82"
        height="83"
        rx="5"
        transform="rotate(-8 65 55)"
      />
      <path class="art-line" d="M40 38H86M40 49H80M40 60H73" />
      <path class="art-solid" d="M104 52H133V96L118 85L104 96Z" />
    </g>
    <g v-else-if="tile === 1">
      <circle class="art-soft" cx="81" cy="51" r="42" />
      <path
        class="art-paper"
        d="M66 77C66 64 48 57 51 39C56 8 105 9 111 38C115 57 96 65 95 77Z"
      />
      <path
        class="art-line"
        d="M66 84H95M70 93H90M80 73V49L70 39M80 49L92 36M28 39H15M136 39H149M39 12L31 4M121 12L129 4"
      />
    </g>
    <g v-else-if="tile === 2">
      <path
        class="art-line"
        d="M80 53L24 22M80 53L134 17M80 53L31 93M80 53L135 92"
      />
      <circle class="art-solid" cx="80" cy="53" r="24" />
      <circle class="art-paper" cx="24" cy="22" r="17" />
      <circle class="art-soft" cx="134" cy="17" r="14" />
      <circle class="art-soft" cx="31" cy="93" r="15" />
      <circle class="art-paper" cx="135" cy="92" r="14" />
      <path class="art-light-line" d="M69 53H91M80 42V64" />
    </g>
    <g v-else>
      <path
        class="art-line"
        d="M79 99V19M80 70Q37 71 28 42Q70 40 80 70M80 48Q119 45 132 16Q87 16 80 48"
      />
      <path class="art-solid" d="M78 70Q37 71 28 42Q70 40 78 70Z" />
      <path class="art-soft" d="M81 48Q119 45 132 16Q87 16 81 48Z" />
      <ellipse class="art-soft" cx="80" cy="101" rx="45" ry="5" />
      <circle class="art-paper" cx="34" cy="17" r="11" />
      <path class="art-line" d="M29 17H39M34 12V22" />
    </g>
  </svg>
</template>
