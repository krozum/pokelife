function spawnNotification(theBody,theIcon,theTitle) {
  var options = {
    body: theBody,
    icon: theIcon
  }
  var n = new Notification(theTitle,options);
}
setTimeout(spawnNotification(), 3000);
