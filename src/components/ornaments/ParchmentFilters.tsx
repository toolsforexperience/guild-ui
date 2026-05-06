/**
 * Procedural texture filters for the illuminated theme. Rendered once at the
 * top of <body>; consumed by .parchment-grain, .parchment-stains, and
 * .parchment-fibre utilities.
 *
 * Three texture layers compose the parchment look:
 *   - grain:   crisp high-frequency specks (paper grit, close-up dust)
 *   - fibre:   directional fibres warped by low-frequency noise (animal skin)
 *   - stains:  clustered low-frequency blotches (foxing, water marks)
 *
 * Plus a deckle-edge filter (parchment-deckle) applied to the paper layer
 * to give the sheet irregular hand-cut edges.
 *
 * Mechanistic regularity is broken via feDisplacementMap: each detail layer
 * is warped by a separate low-frequency turbulence so streaks and specks
 * bend, clump, and break direction the way organic surfaces do.
 */
export function ParchmentFilters() {
  return (
    <svg
      aria-hidden
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>

        {/* Grain: crisp specks varied in density by a low-freq displacement.
            Two turbulences layered (one slightly coarser) + displaced. */}
        <filter id="parchment-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="2"
            result="warp"
          />
          <feTurbulence
            type="turbulence"
            baseFrequency="2.6"
            numOctaves="3"
            seed="7"
            stitchTiles="stitch"
            result="grit"
          />
          <feDisplacementMap
            in="grit"
            in2="warp"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
            result="warpedGrit"
          />
          <feComponentTransfer in="warpedGrit">
            <feFuncA type="table" tableValues="0 0 0 0.1 0.55 0.95 1" />
          </feComponentTransfer>
          <feColorMatrix
            values="0 0 0 0 0.28
                    0 0 0 0 0.17
                    0 0 0 0 0.06
                    0 0 0 0.85 0"
          />
        </filter>

        {/* Fibre: two fibre layers at different angles + heavily displaced.
            Lower anisotropy than before (1.6/0.5 instead of 0.9/0.04) so
            streaks aren't pure horizontal. The displacement breaks them
            into irregular curving fibres. */}
        <filter id="parchment-fibre" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.025"
            numOctaves="3"
            seed="13"
            result="warp"
          />
          <feTurbulence
            type="turbulence"
            baseFrequency="1.6 0.5"
            numOctaves="2"
            seed="3"
            stitchTiles="stitch"
            result="fibreA"
          />
          <feTurbulence
            type="turbulence"
            baseFrequency="0.5 1.4"
            numOctaves="2"
            seed="19"
            stitchTiles="stitch"
            result="fibreB"
          />
          <feBlend in="fibreA" in2="fibreB" mode="multiply" result="fibres" />
          <feDisplacementMap
            in="fibres"
            in2="warp"
            scale="38"
            xChannelSelector="R"
            yChannelSelector="G"
            result="warpedFibres"
          />
          <feComponentTransfer in="warpedFibres">
            <feFuncA type="table" tableValues="0 0 0.05 0.3 0.6 0.85" />
          </feComponentTransfer>
          <feColorMatrix
            values="0 0 0 0 0.32
                    0 0 0 0 0.20
                    0 0 0 0 0.10
                    0 0 0 0.6 0"
          />
        </filter>

        {/* Stains: clustered foxing in a few zones, with large clean regions
            in between. A very-low-frequency "region mask" gates the blot
            pattern so most of the surface stays untouched. Two blot scales
            inside active zones give variation. Heavy displacement breaks
            shape regularity. Hard threshold + low opacity keep it subtle. */}
        <filter id="parchment-stains" x="0" y="0" width="100%" height="100%">
          {/* Region mask: where this is bright, stains can appear; where dark, paper is clean. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0025"
            numOctaves="2"
            seed="42"
            result="region"
          />
          {/* Large rare patches */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="11"
            stitchTiles="stitch"
            result="blotsLarge"
          />
          {/* Small foxing dots */}
          <feTurbulence
            type="turbulence"
            baseFrequency="0.22"
            numOctaves="2"
            seed="31"
            stitchTiles="stitch"
            result="blotsSmall"
          />
          {/* Region × large × small — only co-bright zones produce visible stains */}
          <feBlend in="blotsLarge" in2="blotsSmall" mode="multiply" result="blots" />
          <feBlend in="blots" in2="region" mode="multiply" result="gated" />
          {/* Displace heavily to destroy any residual periodicity */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006"
            numOctaves="2"
            seed="71"
            result="warp"
          />
          <feDisplacementMap
            in="gated"
            in2="warp"
            scale="120"
            xChannelSelector="R"
            yChannelSelector="G"
            result="warpedGated"
          />
          {/* Brutal threshold: only the top ~10% of values survive */}
          <feComponentTransfer in="warpedGated">
            <feFuncA type="table" tableValues="0 0 0 0 0 0 0 0 0 0.15 0.5 0.9" />
          </feComponentTransfer>
          <feColorMatrix
            values="0 0 0 0 0.42
                    0 0 0 0 0.26
                    0 0 0 0 0.10
                    0 0 0 0.85 0"
          />
        </filter>

        {/* Deckle: irregular hand-cut paper edges. Applied via filter:url()
            to a paper layer; the displacement distorts the edge of the
            element's rendered box (background, border, shadow) into an
            organic ragged outline. Text content should live in a sibling
            element on top so it stays crisp.

            Two scales — large for full-page surfaces, small for boxes.
            Boxes use higher frequency + lower amplitude so the waver stays
            subtle rather than reading as a wobbly hand-drawn outline. */}
        <filter id="parchment-deckle" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022"
            numOctaves="2"
            seed="9"
            result="deckleNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="deckleNoise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="deckled"
          />
          {/* Soften the rasterized edge — real paper edges feather where
              fibres splay out rather than cutting cleanly. */}
          <feGaussianBlur in="deckled" stdDeviation="0.6" />
        </filter>

        {/* Ink-wobble: gentle organic distortion for hand-drawn feel on
            knotwork ornaments. Just a small displacement — no morphology,
            no blur — so strokes stay crisp but their paths waver slightly
            off perfect curves. */}
        <filter id="ink-wobble" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            seed="23"
            result="wobbleNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wobbleNoise"
            scale="0.9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="parchment-deckle-sm" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06"
            numOctaves="2"
            seed="17"
            result="deckleNoiseSm"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="deckleNoiseSm"
            scale="2.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="deckledSm"
          />
          <feGaussianBlur in="deckledSm" stdDeviation="0.5" />
        </filter>

        {/* Card deckle: barely-there waver. Tighter frequency + tiny
            displacement = paper has a soft non-mechanical edge without
            looking hand-cut. Used by the default Card component globally;
            Cartouche keeps the more pronounced -sm deckle. */}
        <filter id="parchment-deckle-card" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.18"
            numOctaves="1"
            seed="29"
            result="deckleNoiseCard"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="deckleNoiseCard"
            scale="0.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="deckledCard"
          />
          <feGaussianBlur in="deckledCard" stdDeviation="0.25" />
        </filter>
      </defs>
    </svg>
  );
}
