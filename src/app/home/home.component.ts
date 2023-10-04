import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AmbientLight, Color, PerspectiveCamera, SRGBColorSpace, Scene, WebGLRenderer } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

@Component({
  selector: 'app-home',
  template: `
    <div style = "display: flex; flex-direction: column; align-items: center">
      <h1 style = "text-align: center">hfht</h1>
      <div style = "position: relative; display: flex; align-items: center; justify-content: center">
        <mat-progress-spinner
          *ngIf = "isModelLoading"
          color = "accent"
          mode = determinate
          [value] = progress
          style = "position: absolute; width: 100px; height: 100px">
        </mat-progress-spinner>
        <canvas #turkeyCanvas id = "turkeyCanvas"></canvas>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('turkeyCanvas', {static: false, read: ElementRef})
  private canvasRef!: ElementRef;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private loader!: GLTFLoader;
  private model!: GLTF;

  public progress: number = 0;
  public isModelLoading: boolean = true;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.scene = new Scene();
    this.scene.background = new Color(0, 0, 0);

    const light = new AmbientLight(0x404040, 10) // soft ambient white light
    this.scene.add(light);

    this.camera = new PerspectiveCamera(75, 1, 0.1, 2000);
    this.camera.position.z = 5;

    this.renderer = new WebGLRenderer({canvas: this.canvasRef.nativeElement});
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setSize(500, 500);

    // loading could be moved to ngOnInit() and the loaded model could be set here in ngAfterViewInit() 
    this.loader = new GLTFLoader();
    this.loader.load('assets/models/funky_model.glb',
      (gltf)  => this.onModelLoad(gltf),
      (xhr)   => this.onModelProgress(xhr), 
      function(error) {
        console.error(error)
      }
    )

    this.startRenderingLoop();
  }

  // Copied from here https://github.com/srivastavaanurag79/angular-three/blob/main/src/app/cube/cube.component.ts
  // Without wrapping the animation/rendering in the render() function, only a single frame would
  // be animated, so this is required for now.
  private startRenderingLoop() {
    let component: HomeComponent = this;
    (function render() {
      requestAnimationFrame(render);

      if (component.model) {
        component.model.scene.rotation.x += 0.01;
        component.model.scene.rotation.y += 0.01;
      }
      
      component.renderer.render(component.scene, component.camera);
    }());
  }

  onModelLoad(model: GLTF): void {
    this.model = model;
    this.scene.add(model.scene);
    this.isModelLoading = false;
  }

  onModelProgress(xhr: ProgressEvent<EventTarget>): void {
    this.progress = Math.trunc( xhr.loaded / xhr.total * 100 );
  }
}
