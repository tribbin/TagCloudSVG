# TagCloudSVG v1

A modern and customizable TagCloud using SVG.

<style>
    svg#tagcloudsvg {
        background-color: black;
    }

    .tag {
        font-size: 4em;
    }

    .high {
        fill: white;
    }

    .middle {
        fill: blue;
    }

    .vertical {
        fill: darkblue;
    }

    .low {
        fill: grey;
    }
</style>

<script src="tagcloudsvg.js" type="text/javascript"></script>

<svg id='tagcloudsvg' viewbox='0 0 1920 1080'></svg>

<script>

    var clouds = [
        { "label": "Cirrus", "class": [ "high" ] },
        { "label": "Cirrocumulus", "class": ["high"] },
        { "label": "Cirrostratus", "class": ["high"] },
        { "label": "Altocumulus", "class": ["middle"] },
        { "label": "Altostratus", "class": ["middle"] },
        { "label": "Cumulonimbus", "class": ["vertical"] },
        { "label": "Cumulus", "class": ["vertical"] },
        { "label": "Nimbostratus", "class": ["vertical"] },
        { "label": "Stratocumulus", "class": ["low"] },
        { "label": "Small Cu", "class": ["low"] },
        { "label": "Stratus", "class": ["low"] },
    ];

    function animate() {
        rotateAndZoom(0.01,0.008,0.005,0.01);
    }

    makeTagCloudSVG(clouds);

</script>

## Example.html

The **example.html** file provides a good implementation example.

## Step-by-step

These are the necessary steps to build a TagCloudSVG.

* Call the tagcloudsvg.js script from your webpage:
```html
  <script src="tagcloudsvg.js" type="text/javascript"></script>
```
* Include an SVG-element in the body of your webpage with ID 'tagcloudsvg' with a viewbox of '0 0 1920 1080':
```html
  <svg id='tagcloudsvg' viewbox='0 0 1920 1080'></svg>
```
* Build a JSON array. All fields are optional, but 'label' will be used as the tag's element-text and 'class' (an array!) will be set as the tag's CSS classes.
```html
  <script>
    var clouds = [
        { "label": "Cirrus", "class": [ "high" ] },
        { "label": "Cirrocumulus", "class": ["high"] },
        { "label": "Cirrostratus", "class": ["high"] },
        { "label": "Altocumulus", "class": ["middle"] },
        { "label": "Altostratus", "class": ["middle"] },
        { "label": "Cumulonimbus", "class": ["vertical"] },
        { "label": "Cumulus", "class": ["vertical"] },
        { "label": "Nimbostratus", "class": ["vertical"] },
        { "label": "Stratocumulus", "class": ["low"] },
        { "label": "Small Cu", "class": ["low"] },
        { "label": "Stratus", "class": ["low"] },
    ];
  </script>
```
* Write a function called animate() with no arguments that is being called for every animation-frame:
```html
  <script>
    function animate() {
      rotateAndZoom(0.01,0.008,0.005,0.01);
    }
  </script>
```
* Provide the JSON when calling makeTagCloudSVG():
```html
  <script>
    makeTagCloudSVG(clouds);
  </script>
```
* Optionally use CSS to style the cloud and tags:
```html
  <style>
      #tagcloudsvg {
        background-color: black;
      }

      .tag {
        font-size: 4em;
      }

      .high {
        fill: white;
      }

      .middle {
        fill: blue;
      }

      .vertical {
        fill: darkblue;
      }

      .low {
        fill: grey;
      }
    </style>
```
