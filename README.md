#TagCloudSVG

##Example.html

The **example.html** file provides a good implementation example.

##Step-by-step

These are the necessary steps to build a TagCloudSVG.

* Call the jQuery script from you webpage:
```
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
```
* Call the tagcloudsvg.js script from you webpage:
```
  <script src="tagcloudsvg/tagcloudsvg.js" type="text/javascript"></script>
```
* Include an SVG-element in the body of your webpage with ID 'tagcloudsvg' with a viewbox of '0 0 1920 1080':
```
  <svg id='tagcloudsvg' viewbox='0 0 1920 1080'></svg>
```
* Build a JSON with an array. Every entry has at least a label and an array of classes.
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
* Provide this JSON when calling makeTagCloudSVG():
```
  <script>
    makeTagCloudSVG(clouds);
  </script>
```
* Write a function that is being called for every animation-frame:
```
  <script>
    function animate() {
      rotateAndZoom(clouds,0.01,0.008,0.005,0.01);
    }
  </script>
```
* Add interval to repeatedly call this script:
```
  <script>
    setInterval(animate, 1000/20);
  </script>
```
* Use CSS to style the cloud and tags:
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

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

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

      makeTagCloudSVG(clouds);

      function animate() {
        rotateAndZoom(clouds,0.01,0.008,0.005,0.01);
      }

      setInterval(animate, 1000/20);

    </script>
  </body>
</html>
```
