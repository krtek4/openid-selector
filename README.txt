OVERVIEW
-------------------
This is a simple Javascript OpenID selector. It has been designed so 
that users do not even need to know what OpenID is to use it, they 
simply select their account by a recognisable logo.

USAGE
-------------------
See demo.html source

TROUBLESHOOTING
----------------------------
Please remember after you change list of providers, you must run 
generate-sprite.js <lang> to refresh sprite image

generate-sprite.js requires ImageMagick to be installed and works
only in Windows (Linux and Apple users can run in VM)

Before running generate-sprite.js for the first time, check its
source code and correct line 16 (var imagemagick = '<...>';) to 
point to ImageMagick install dir.

HOWTO
-------------------
1. how to create new (small) provider icon
   a. launch web browser, go to http://<provider-site>/favicon.ico
      and save the image as <provider>.ico in ./images.small folder
   b. launch GIMP or Photoshop and save 16x16 rendition from the 
      icon as <provider>.ico.gif
   c. use ImageMagick command like 
      convert <provider>.ico <provider>.ico.png to convert the icon
      to PNG format (it might generate several files, just pick 16x16
      rendition and rename it as <provider>.ico.png w/o .1.)

2. how to plug-in facebook provider
   TODO, it is possible see FAQ comments

LICENSE
-------------------
This code is licenced under the New BSD License.

