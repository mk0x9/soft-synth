var bits = 16,
  sample_rate = 44100,
  pitch_duration = 15,
  total_header = 44,
  freq = 410;

var wave_data_size = sample_rate * (bits / 8) * pitch_duration,
  wave_header = 36;

function c (f) {
  return f.charCodeAt(0);
}

function play (string) {
  var audio = document.createElement('audio');
  audio.controls = true;
  audio.src = 'data:audio/wav;base64,' + btoa(string);
  document.body.appendChild(audio);
}

var view = new Uint8Array(new ArrayBuffer(44));

view[0]  = c('R');
view[1]  = c('I');
view[2]  = c('F');
view[3]  = c('F');

view[4]  = (wave_data_size + wave_header) & 0xff;
view[5]  = ((wave_data_size + wave_header) >> 8) & 0xff;
view[6]  = ((wave_data_size + wave_header) >> 16) & 0xff;
view[7]  = ((wave_data_size + wave_header) >> 24) & 0xff;

view[8]  = c('W');
view[9]  = c('A');
view[10] = c('V');
view[11] = c('E');

view[12] = c('f');
view[13] = c('m');
view[14] = c('t');
view[15] = c(' ');

view[16] = 16;
view[17] = 0;
view[18] = 0;
view[19] = 0;

view[20] = 1;
view[21] = 0;

view[22] = 1;
view[23] = 0;

view[24] = sample_rate & 0xff;
view[25] = (sample_rate >> 8) & 0xff;
view[26] = (sample_rate >> 16) & 0xff;
view[27] = (sample_rate >> 24) & 0xff;

view[28] = (sample_rate * (bits / 8)) & 0xff;
view[29] = ((sample_rate * (bits / 8)) >> 8) & 0xff;
view[30] = ((sample_rate * (bits / 8)) >> 8) & 0xff;
view[31] = ((sample_rate * (bits / 8)) >> 8) & 0xff;

view[32] = (bits / 8) & 0xff;
view[33] = ((bits / 8) >> 8) & 0xff;

view[34] = bits & 0xff;
view[35] = (bits >> 8) & 0xff;

view[36] = c('d');
view[37] = c('a');
view[38] = c('t');
view[39] = c('a');

view[40] = wave_data_size & 0xff;
view[41] = (wave_data_size >> 8) & 0xff;
view[42] = (wave_data_size >> 16) & 0xff;
view[43] = (wave_data_size >> 24) & 0xff;

var header = String.fromCharCode.apply(0, view);

var amplitude = Math.floor((1 << bits) / 2 - 1);

function generate_sample(i) {
  return(Math.sin(i * 2 * Math.PI * freq / sample_rate) * amplitude);
}

data = '';

for (var i = 0; i < wave_data_size; i++) {
 var sample = generate_sample(i);
 data += String.fromCharCode(sample & 0xff) + String.fromCharCode((sample >> 8) & 0xff);
}

play(header + data);
