import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-local-video',
  templateUrl: './local-video.component.html',
  styleUrls: ['./local-video.component.css']
})
export class LocalVideoComponent implements OnInit {
  private devices;

  private pc1;
  private pc2;

  private localStream = null;

  @ViewChild('video_preview') videoref : ElementRef;
  public video : HTMLVideoElement;

  constructor() { }

  ngOnInit() {

    this.video = this.videoref.nativeElement;
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
        //let localVideo : HTMLVideoElement = document.getElementById('video-preview') as HTMLVG;
        //localVideo.srcObject = stream;
        this.video.src  = 'http://1253619058.vod2.myqcloud.com/327d0be7vodgzp1253619058/004285dd7447398155873749913/zOaPx3hdWJIA.mp4?t=5b116d80&us=1527868800&sign=387435e065b62c7afba7a68112b00891';
        this.video.play();
        //obj.localStream = stream;
        //obj.openPeerconnection(obj);
      }).catch(function () {
      });
  }

  openPeerconnection(obj) : void {
    var servers = null;
    var pc1 = new RTCPeerConnection(servers);
    console.log('Created local peer connection object pc1');
    pc1.onicecandidate = function(e) {
      obj.onIceCandidate(pc1, e);
    };

    pc1.oniceconnectionstatechange = function(e) {
      //onIceStateChange(pc1, e);
    };

    obj.localStream.getTracks().forEach(
      function(track) {
        // pc1.addTrack(
        //   track,
        //   localStream
        // );
      }
    );
    console.log('Added local stream to pc1');
  
    console.log('pc1 createOffer start');
    pc1.createOffer(
      // offerOptions
    ).then(
      this.onCreateOfferSuccess,
      this.onCreateSessionDescriptionError
    );

  }

  onCreateSessionDescriptionError(error) {
    console.log('Failed to create session description: ' + error.toString());
  }
  
  onCreateOfferSuccess(desc) {
    console.log('Offer from pc1\n' + desc.sdp);
    console.log('pc1 setLocalDescription start');
  }

  getName(pc) {
    return (pc === this.pc1) ? 'pc1' : 'pc2';
  }
  
  getOtherPc(pc) {
    return (pc === this.pc1) ? this.pc2 : this.pc1;
  }

  onIceCandidate(pc, event) : void {
    this.getOtherPc(pc).addIceCandidate(event.candidate)
    .then(
      function() {
        this.onAddIceCandidateSuccess(pc);
      },
      function(err) {
        this.onAddIceCandidateError(pc, err);
      }
    );
    console.log(this.getName(pc) + ' ICE candidate: \n' + (event.candidate ?
        event.candidate.candidate : '(null)'));
  }

}
