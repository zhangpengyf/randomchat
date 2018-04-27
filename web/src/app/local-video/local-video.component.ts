import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-local-video',
  templateUrl: './local-video.component.html',
  styleUrls: ['./local-video.component.css']
})
export class LocalVideoComponent implements OnInit {
  private devices;
  
  constructor() { }

  ngOnInit() {
    var obj = this;
    window.navigator.mediaDevices.enumerateDevices()
      .then(function (deviceInfos) {
        if (deviceInfos.length > 0) {
          obj.openLocalVideo(deviceInfos);
        }
      }).catch(function (e) {
        console.error(e);
      });
  }

  openLocalVideo(deviceInfos) : void {
    var obj = this;
    var constraints = {
      audio: true,
      video: true,
    };
    window.navigator.mediaDevices.getUserMedia(constraints).
      then(function (stream) {
        var localVideo = document.getElementById('video-preview');
        localVideo.srcObject = stream;
      }).catch(function () {
      });
  }

}
