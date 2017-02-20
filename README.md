#TagCloudSVG

A modern and customizable TagCloud using SVG and JSON.

##Example.html

The **example.html** file provides a good implementation example.

##Step-by-step

These are the necessary steps to build a TagCloudSVG.

* Call the tagcloudsvg.js script from your webpage:
```
  <script src="tagcloudsvg.js" type="text/javascript"></script>
```
* Include an SVG-element in the body of your webpage with ID 'tagcloudsvg' with a viewbox of '0 0 1920 1080':
```
  <svg id='tagcloudsvg' viewbox='0 0 1920 1080'></svg>
```
* Build a JSON array. All fields are optional, but 'label' will be used as the tag's element-text and 'class' (, which must be an array!) will be set as the tag's CSS classes.
```
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
```
  <script>
    function animate() {
      rotateAndZoom(0.01,0.008,0.005,0.01);
    }
  </script>
```
* Provide this JSON when calling makeTagCloudSVG():
```
  <script>
    makeTagCloudSVG(clouds);
  </script>
```
* Optionally use CSS to style the cloud and tags:
```
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
##Everything combined
```
<!DOCTYPE html>
<html>
  <head>
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
  </head>
  <body>

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
  </body>
</html>
```
