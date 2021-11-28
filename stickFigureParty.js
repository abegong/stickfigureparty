const StickFigureParty = {

  stroke_width: 4,
  control_point_radius: 6,
  random_generator: null,

  // ----- Methods to generate control points -----//

  gen_torso() {
    return {
      neck_x: 40 + 20 * this.random_generator(),
      neck_y: 17 + 10 * this.random_generator(),
      torso_control_x: 40 + 20 * this.random_generator(),
      torso_control_y: 40 + 20 * this.random_generator(),
      pelvis_x: 40 + 20 * this.random_generator(),
      pelvis_y: 50 + 10 * this.random_generator(),
    };
  },

  gen_head(neck_x, neck_y) {
    return {
      head_x: neck_x - 15 + 10 * this.random_generator(),
      head_y: neck_y - 15 + 10 * this.random_generator(),
    };
  },

  gen_legs() {
    const y = 82 + 5 * this.random_generator();

    return {
      left_foot_x: 30,
      left_foot_y: y - 10 + 20 * this.random_generator(),
      left_knee_control_x: 20 + 40 * this.random_generator(),
      left_knee_control_y: 50 + 40 * this.random_generator(),
      right_foot_x: 60,
      right_foot_y: y - 10 + 20 * this.random_generator(),
      right_knee_control_x: 40 + 40 * this.random_generator(),
      right_knee_control_y: 50 + 40 * this.random_generator(),
    };
  },

  gen_arms() {
    return {
      left_hand_x: 20 + 50 * this.random_generator(),
      left_hand_y: 2 + 66 * this.random_generator(),
      left_shoulder_control_x: 40 + 20 * this.random_generator(),
      left_shoulder_control_y: 28 + 20 * this.random_generator(),
      right_shoulder_control_x: 40 + 20 * this.random_generator(),
      right_shoulder_control_y: 28 + 20 * this.random_generator(),
      right_hand_x: 20 + 50 * this.random_generator(),
      right_hand_y: 2 + 66 * this.random_generator(),
    };
  },

  generate_control_points(seed) {
    this.random_generator = new Math.seedrandom(seed);

    let control_points = this.gen_torso();

    control_points = {
      ...control_points,
      ...this.gen_head(
        control_points.neck_x,
        control_points.neck_y,
      ),
    };

    control_points = {
      ...control_points,
      ...this.gen_legs(
        control_points.pelvis_x,
        control_points.pelvis_y,
      ),
    };

    control_points = {
      ...control_points,
      ...this.gen_arms(),
    };

    return control_points;
  },
  // ----- Methods to draw stick figures, given a canvas and control points -----//

  gen_torso_path_string(cp) {
    return `M${cp.neck_x},${cp.neck_y} C${cp.torso_control_x},${cp.torso_control_y} ${cp.torso_control_x},${cp.torso_control_y} ${cp.pelvis_x},${cp.pelvis_y}`;
  },

  draw_torso(
    canvas,
    cp,
    show_control_points,
    control_point_color,
    control_point_opacity,
    color,
  ) {
    const path_string = this.gen_torso_path_string(cp);

    canvas
      .path(path_string)
      .fill('none')
      .stroke({
        color,
        width: this.stroke_width,
        linecap: 'round',
        linejoin: 'round',
      })
      .addClass('spine');

    if (show_control_points) {
      canvas.circle(this.control_point_radius)
        .move(
          cp.torso_control_x - this.control_point_radius / 2,
          cp.torso_control_y - this.control_point_radius / 2,
        )
        .fill({ color: control_point_color })
        .opacity(control_point_opacity);
    }
  },

  draw_head(
    canvas,
    cp,
    show_control_points,
    control_point_color,
    control_point_opacity,
    color,
    fill,
  ) {
    canvas
      .circle(20)
      .move(cp.head_x, cp.head_y)
      .fill({ color: fill })
      .stroke({
        color,
        width: this.stroke_width,
        linecap: 'round',
        linejoin: 'round',
      })
      .addClass('head');

    if (show_control_points) {
      canvas
        .circle(this.control_point_radius)
        .move(cp.neck_x - this.control_point_radius / 2, cp.neck_y - this.control_point_radius / 2)
        .fill({ color: control_point_color })
        .opacity(control_point_opacity);
    }
  },

  gen_arms_path_string(cp) {
    return `M${cp.left_hand_x},${cp.left_hand_y} C${cp.left_shoulder_control_x},${cp.left_shoulder_control_y} ${cp.right_shoulder_control_x},${cp.right_shoulder_control_y} ${cp.right_hand_x},${cp.right_hand_y}`;
  },

  draw_arms(
    canvas,
    cp,
    show_control_points,
    control_point_color,
    control_point_opacity,
    color,
  ) {
    const path_string = this.gen_arms_path_string(cp);

    canvas
      .path(path_string)
      .fill('none')
      .stroke({
        color,
        width: this.stroke_width,
        linecap: 'round',
        linejoin: 'round',
      })
      .addClass('arms');

    canvas
      .circle(this.control_point_radius)
      .move(
        cp.left_hand_x - this.control_point_radius / 2,
        cp.left_hand_y - this.control_point_radius / 2,
      )
      .fill({ color })
      .addClass('left-hand');

    canvas
      .circle(this.control_point_radius)
      .move(
        cp.right_hand_x - this.control_point_radius / 2,
        cp.right_hand_y - this.control_point_radius / 2,
      )
      .fill({ color })
      .addClass('right-hand');

    if (show_control_points) {
      canvas
        .circle(this.control_point_radius)
        .move(
          cp.left_shoulder_control_x - this.control_point_radius / 2,
          cp.left_shoulder_control_y - this.control_point_radius / 2,
        )
        .fill({ color: control_point_color })
        .opacity(control_point_opacity);

      canvas
        .circle(this.control_point_radius)
        .move(
          cp.right_shoulder_control_x - this.control_point_radius / 2,
          cp.right_shoulder_control_y - this.control_point_radius / 2,
        )
        .fill({ color: control_point_color })
        .opacity(control_point_opacity);
    }
  },

  gen_left_leg_path_string(cp) {
    return `M${cp.pelvis_x},${cp.pelvis_y} C${cp.left_knee_control_x},${cp.left_knee_control_y} ${cp.left_knee_control_x},${cp.left_knee_control_y} ${cp.left_foot_x},${cp.left_foot_y}`;
  },

  gen_right_leg_path_string(cp) {
    return `M${cp.pelvis_x},${cp.pelvis_y} C${cp.right_knee_control_x},${cp.right_knee_control_y} ${cp.right_knee_control_x},${cp.right_knee_control_y} ${cp.right_foot_x},${cp.right_foot_y}`;
  },

  draw_legs(
    canvas,
    cp,
    show_control_points,
    control_point_color,
    control_point_opacity,
    color,
  ) {
    canvas
      .path(
        this.gen_right_leg_path_string(cp),
      )
      .fill('none')
      .stroke({
        color,
        width: this.stroke_width,
        linecap: 'round',
        linejoin: 'round',
      })
      .addClass('right-leg');

    canvas
      .path(
        this.gen_left_leg_path_string(cp),
      )
      .fill('none')
      .stroke({
        color,
        width: this.stroke_width,
        linecap: 'round',
        linejoin: 'round',
      })
      .addClass('left-leg');

    canvas
      .circle(this.control_point_radius)
      .move(
        cp.left_foot_x - this.control_point_radius / 2,
        cp.left_foot_y - this.control_point_radius / 2,
      )
      .fill({ color })
      .addClass('left-foot');

    canvas
      .circle(this.control_point_radius)
      .move(
        cp.right_foot_x - this.control_point_radius / 2,
        cp.right_foot_y - this.control_point_radius / 2,
      )
      .fill({ color })
      .addClass('right-foot');

    if (show_control_points) {
      canvas
        .circle(this.control_point_radius)
        .move(
          cp.pelvis_x - this.control_point_radius / 2,
          cp.pelvis_y - this.control_point_radius / 2,
        )
        .fill({ color: control_point_color })
        .opacity(control_point_opacity);

      canvas
        .circle(this.control_point_radius)
        .move(
          cp.left_knee_control_x - this.control_point_radius / 2,
          cp.left_knee_control_y - this.control_point_radius / 2,
        )
        .fill({ color: control_point_color })
        .opacity(control_point_opacity);

      canvas
        .circle(this.control_point_radius)
        .move(
          cp.right_knee_control_x - this.control_point_radius / 2,
          cp.right_knee_control_y - this.control_point_radius / 2,
        )
        .fill({ color: control_point_color })
        .opacity(control_point_opacity);
    }
  },

  draw_stick_figure(
    canvas,
    control_points,
    size,
    show_control_points,
    control_point_color,
    control_point_opacity,
    color,
    fill,
    id,
  ) {
    size = 100;
    canvas.size(size, size);
    // let scale = Math.sqrt(size*1.0/100.0);
    // let scale = size*1.0/100.0;
    // canvas.transform({
    //   scale : scale
    // })
    if (fill) {
      canvas.rect(100, 100).fill(fill);
    }
    if (id) {
      canvas.attr('id', id);
    }

    this.draw_torso(
      canvas,
      control_points,
      show_control_points,
      control_point_color,
      control_point_opacity,
      color,
    );
    this.draw_head(
      canvas,
      control_points,
      show_control_points,
      control_point_color,
      control_point_opacity,
      color,
      fill || 'white',
    );
    this.draw_arms(
      canvas,
      control_points,
      show_control_points,
      control_point_color,
      control_point_opacity,
      color,
    );
    this.draw_legs(
      canvas,
      control_points,
      show_control_points,
      control_point_color,
      control_point_opacity,
      color,
    );
  },

  add_stick_figure(
    dom_element_id,
    control_points,
    parameters,
  ) {
    parameters = parameters || {};
    const canvas = SVG().addTo(dom_element_id);
    this.draw_stick_figure(
      canvas,
      control_points || this.generate_control_points(parameters.seed),
      parameters.size || 100,
      parameters.show_control_points || false,
      parameters.control_point_color || 'red',
      parameters.control_point_opacity || 0.3,
      parameters.color || '#222',
      parameters.fill || false,
      parameters.id,
    );
  },
};
