$(document).ready(function(){

    const notesToPlay = {
        // M9
        major: {
            'C': ["C4", "E4", "G4", "B4", "D5", "B4", "G4", "E4"],
            'C#': ["C#4", "F4", "G#4", "C5", "D5", "C5", "G#4", "F4"],
            'D': ["D4", "F#4", "A4", "C#5", "E5", "C#5", "A4", "F#4"],
            'D#': ["D#4", "G4", "A#4", "D5", "F5", "D5", "A#4", "G4"],
            'E': ["E4", "G#4", "B4", "D#5", "F#5", "D#5", "B4", "G#4"],
            'F': ["F4", "A4", "C5", "E5", "G5", "E5", "C5", "A4"],
            'F#': ["F#4", "A#4", "C#5", "F5", "G#5", "F5", "C#5", "A#4"],
            'G': ["G4", "B4", "D5", "F#5", "A5", "F#5", "D5", "B4"],
            'G#': ["G#4", "C5", "D#5", "G5", "A#5", "G5", "D#5", "C5"],
            'A': ["A4", "C#5", "E5", "G#5", "B5", "G#5", "E5", "C#5"],
            'A#': ["A#4", "C5", "D5", "F5", "A5", "F5", "D5", "C5"],
            'B': ["B4", "C#5", "D#5", "F#5", "A#5", "F#5", "D#5", "C#5"],
        },
        // m7
        minor: {
            'c': ["C4", "D#4", "G4", "A#4", "G4", "D#4"],
            'c#': ["C#4", "E4", "G#4", "B4", "G#4", "E4"],
            'd': ["D4", "F4", "A4", "C5", "A4", "F4"],
            'd#': ["D#4", "F#4", "A#4", "C#5", "A#4", "F#4"],
            'e': ["E4", "G4", "B4", "D5", "B4", "G4"],
            'f': ["F4", "G#4", "C5", "D#5", "C5", "G#4"],
            'f#': ["F#4", "A4", "C#5", "E5", "C#5", "A4"],
            'g': ["G4", "A#4", "D5", "F5", "D5", "A#4"],
            'g#': ["G#4", "B4", "D#5", "F#5", "D#5", "B4"],
            'a': ["A4", "C5", "E5", "G5", "E5", "C5"],
            'a#': ["A#4", "C#5", "F5", "G#5", "F5", "C#5"],
            'b': ["B4", "D5", "F#5", "A5", "F#5", "D5"],
        }
    };

    let globalBpm = 120;
    let globalNewBpm = 120;
    let globalCurrentData = null;
    let globalIndex = 0;
    let globalRepeatPlayToneFunction = false;
    let globalPlayNoteSetTimeout;
    const globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();

    let widthOfSection = $('section').width();
    let barSVGWidth = widthOfSection;
    const barSVGHeight = 200;

    let loopBeat;
    let synth;

    let widthOfPieDiv = $('#renderPie').width();
    if(widthOfPieDiv > 500){
        widthOfPieDiv = 500;
    }
    const pieSVGWidth = widthOfPieDiv;
    const pieSVGHeight = widthOfPieDiv;
    const pieChartPadding = 40;

    function renderPie() {
        var outerPieData = [
            { label: 'C', value: 1 },
            { label: 'G', value: 1 },
            { label: 'D', value: 1 },
            { label: 'A', value: 1 },
            { label: 'E', value: 1 },
            { label: 'B', value: 1 },
            { label: 'F#', value: 1 },
            { label: 'C#', value: 1 },
            { label: 'G#', value: 1 },
            { label: 'D#', value: 1 },
            { label: 'A#', value: 1 },
            { label: 'F', value: 1 },
        ];

        var innerPieData = [
            { label: 'd', value: 1 },
            { label: 'a', value: 1 },
            { label: 'e', value: 1 },
            { label: 'b', value: 1 },
            { label: 'f#', value: 1 },
            { label: 'c#', value: 1 },
            { label: 'g#', value: 1 },
            { label: 'd#', value: 1 },
            { label: 'a#', value: 1 },
            { label: 'f', value: 1 },
            { label: 'c', value: 1 },
            { label: 'g', value: 1 },
        ];

        const outerColorData = ['#f6be37', '#d1c12e', '#95c631', '#4bb250', '#45b5a1', '#4598b6', '#4e61d8', '#8064c6', '#a542b1', '#ed3883', '#f75839', '#f7943d'];
        const innerColorData = ['#95c631', '#4bb250', '#45b5a1', '#4598b6', '#4e61d8', '#8064c6', '#a542b1', '#ed3883', '#f75839', '#f7943d', '#f6be37', '#d1c12e'];
        const radius = Math.min(pieSVGWidth - pieChartPadding, pieSVGHeight - pieChartPadding) / 2;

        const svg = d3.select('#renderPie')
            .append('svg')
            .attr('width', pieSVGWidth)
            .attr('height', pieSVGHeight);

        const cnt = svg.append('g')
            .attr('transform', `translate(${pieSVGWidth / 2}, ${pieSVGHeight / 2})`);

        const outerColor = d3.scaleOrdinal(outerColorData);
        const innerColor = d3.scaleOrdinal(innerColorData);

        const pie = d3.pie().value(function (d) {
            return d.value;
        });

        // outer pie ===================================
        const path = d3.arc()
            .innerRadius(radius/3*2)
            .outerRadius(radius);

        const label = d3.arc()
            .innerRadius(radius/3*2)
            .outerRadius(radius);

        const arcs = cnt.selectAll('arc')
            .data(pie(outerPieData))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('data-scale', 'major')
            .attr('data-root', function(d){
                return d.data.label;
            });

        arcs.append('path')
            .attr('fill', function (d, i) {
                return outerColor(i);
            })
            .attr('d', path);

        arcs.append('text')
            .attr('transform', function (d) {
                return 'translate(' + label.centroid(d) + ')';
            })
            .attr('dy', '.35em')
            .text(function (d) {
                return d.data.label;
            });
        // end outer pie===================================

        // inner pie ==================================
        const path2 = d3.arc()
            .innerRadius(radius/3-10)
            .outerRadius(radius/3*2);

        const label2 = d3.arc()
            .innerRadius(radius/3)
            .outerRadius(radius/3*2);

        const arcs2 = cnt.selectAll('arc')
            .data(pie(innerPieData))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('data-scale', 'minor')
            .attr('data-root', function(d){
                return d.data.label;
            });

        arcs2.append('path')
            .attr('fill', function (d, i) {
                return innerColor(i);
            })
            .attr('d', path2);

        arcs2.append('text')
            .attr('transform', function (d) {
                return 'translate(' + label2.centroid(d) + ')';
            })
            .attr('dy', '.35em')
            .text(function (d) {
                return d.data.label;
            });
        // end inner pie=============================

        // center circle===========================
        const circleGroup = cnt.append('g')
            .attr('class', 'circleGroup');

        // append circle button
        circleGroup.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', radius * 0.3)
            .attr('fill', 'white')
            .attr('id', 'circleButton')
            .attr('data-isPlaying', 'false');

        circleGroup.append('image')
            .attr('width', '36px')
            .attr('height', '36px')
            .attr('x', '-18px')
            .attr('y', '-18px')
            .attr('xlink:href', 'images/play-icon.png');


        // add event listener====================================
        d3.selectAll('.arc').on('click', function () {
            const scale = $(this).closest('.arc').attr('data-scale');

            const rootNote = $(this).closest('.arc').attr('data-root');

            const newCurrentData = notesToPlay[scale][rootNote];

            const isPlaying = d3.select('#circleButton').attr('data-isPlaying');
            
            if(newCurrentData.length === globalCurrentData.length){
                globalCurrentData = newCurrentData;

                updateBars(globalCurrentData);
            }
            else{
                globalCurrentData = newCurrentData;

                updateBars(globalCurrentData);

                // reset index
                globalIndex = 0;

                // reset animateThisLine
                d3.select('.animateThisLine')
                    .transition()
                    .duration(0)
                    .style('left', '0px')
                    .style('opacity', 0);

                // reset activeBar
                d3.selectAll('.bar').classed('activeBar', false);

                // if alreay playing, replay tone
                if(isPlaying === 'true'){
                    clearTimeout(globalPlayNoteSetTimeout);
                    globalRepeatPlayToneFunction = true;
                    playTone();
                }
            }

            if(isPlaying === 'false'){
                playThreeNotes();
            }

            // take off activePie class from all arc
            d3.selectAll('.arc').select('path').attr('class', '');

            // add activePie class to change color of the active arc
            d3.select(this).select('path').attr('class', 'activePie');

        });

        d3.select('.circleGroup').on('click', function () {
            const isPlaying = d3.select('#circleButton').attr('data-isPlaying');

            if (isPlaying === 'true') {
                d3.select('#circleButton').attr('data-isPlaying', 'false');

                globalRepeatPlayToneFunction = false;
                clearTimeout(globalPlayNoteSetTimeout);

                // reset animateThisLine
                d3.select('.animateThisLine')
                    .transition()
                    .duration(0)
                    .style('left', '0px')
                    .style('opacity', 0);

                // reset activeBar
                // d3.selectAll('.bar').classed('activeBar', false);

                // remove pause icon and change to play button
                d3.select('.circleGroup').select('image').remove();

                circleGroup.append('image')
                    .attr('width', '36px')
                    .attr('height', '36px')
                    .attr('x', '-18px')
                    .attr('y', '-18px')
                    .attr('xlink:href', 'images/play-icon.png');
            }
            else {
                d3.select('#circleButton').attr('data-isPlaying', 'true');

                // reset index
                globalIndex = 0;
                
                clearTimeout(globalPlayNoteSetTimeout);
                globalRepeatPlayToneFunction = true;
                playTone();
            
                // remove play icon and change to pause button
                d3.select('.circleGroup').select('image').remove()

                circleGroup.append('image')
                    .attr('width', '36px')
                    .attr('height', '36px')
                    .attr('x', '-18px')
                    .attr('y', '-18px')
                    .attr('xlink:href', 'images/pause-icon.png');

            }
        });

    }

    function renderSVGForBar() {
        // remove svg for resizing bar chart
        d3.select('#renderBar').select('svg').remove();

        const svg = d3.select('#renderBar')
            .append('svg')
            .attr('id', 'barChart')
            .attr('width', barSVGWidth)
            .attr('height', barSVGHeight);

        $('#renderBar').append("<div class='animateThisLine'></div>")
    }

    function updateBars(noteData) {
        const notesToRender = noteData;
        const patterns = [
            { note: 'C4', value: 1  , color: '#f6be37'},
            { note: 'C#4', value: 2  , color: '#8064c6'},
            { note: 'D4', value: 3  , color: '#95c631'},
            { note: 'D#4', value: 4  , color: '#ed3883'},
            { note: 'E4', value: 5  , color: '#45b5a1'},
            { note: 'F4', value: 6  , color: '#f7943d'},
            { note: 'F#4', value: 7  , color: '#4e61d8'},
            { note: 'G4', value: 8  , color: '#d1c12e'},
            { note: 'G#4', value: 9  , color: '#a542b1'},
            { note: 'A4', value: 10  , color: '#4bb250'},
            { note: 'A#4', value: 11  , color: '#f75839'},
            { note: 'B4', value: 12  , color: '#4598b6'},
            { note: 'C5', value: 13  , color: '#f6be37'},
            { note: 'C#5', value: 14  , color: '#8064c6'},
            { note: 'D5', value: 15  , color: '#95c631'},
            { note: 'D#5', value: 16  , color: '#ed3883'},
            { note: 'E5', value: 17  , color: '#45b5a1'},
            { note: 'F5', value: 18  , color: '#f7943d'},
            { note: 'F#5', value: 19  , color: '#4e61d8'},
            { note: 'G5', value: 20  , color: '#d1c12e'},
            { note: 'G#5', value: 21  , color: '#a542b1'},
            { note: 'A5', value: 22  , color: '#4bb250'},
            { note: 'A#5', value: 23  , color: '#f75839'},
            { note: 'B5', value: 24  , color: '#4598b6'},
        ];

        const barData = [];

        for (let i = 0; i < notesToRender.length; i++) {
            // make it 3 characters for regex
            if(notesToRender[i].length === 2){
                notesToRender[i] = notesToRender[i] + " ";
            }

            for (let j = 0; j < patterns.length; j++) {
                // make it 3 characters for regex
                if(patterns[j].note.length === 2){
                    patterns[j].note = patterns[j].note + " ";
                }

                const patt = new RegExp(patterns[j].note);

                if (patt.test(notesToRender[i])) {
                    barData.push({
                        index: i,
                        value: patterns[j].value,
                    });
                }
            }
        }

        // console.log('barData: ', barData);

        const xScale = d3.scaleBand()
            .domain(barData.map(function(d){
                return d.index;
            }))
            .range([0, barSVGWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 28])
            .range([barSVGHeight, 0])
            .clamp(true);

        const selection = d3.select('#renderBar').select('svg').selectAll('.bar');
        const binding = selection.data(barData);

        // update existing bar
        binding.transition()
            .duration(200)
            .attr('x', function (d) {
                return xScale(d.index);
            })
            .attr('y', function (d) {
                return yScale(d.value);
            })
            .attr('width', xScale.bandwidth())
            .attr('height', function (d) {
                // return barSVGHeight - yScale(d);
                return 5;
            })
            .attr('fill', function(d){
                const colorIndex = patterns.findIndex(function(val){
                    return val.value === d.value;
                });
                return patterns[colorIndex].color;
            });

        // enter new bar
        binding.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function (d) {
                return xScale(d.index);
            })
            .attr('y', function (d) {
                return yScale(d.value);
            })
            .attr('width', xScale.bandwidth())
            .attr('height', function (d) {
                // return barSVGHeight - yScale(d);
                return 5;
            })
            .attr('fill', function(d){
                const colorIndex = patterns.findIndex(function(val){
                    return val.value === d.value;
                });
                return patterns[colorIndex].color;
            })
            .transition()
            .duration(200)
            .style('opacity', 1);

        // exit bar
        binding.exit()
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();

    }

    function animateLine() {

        const totalTime = 60000 / globalBpm * globalCurrentData.length /2;

        // reset left to 0
        const line = d3.select('.animateThisLine');

        line.transition()
            .duration(0)
            .style('left', '0px')
            .style('opacity', 1);

        line.transition()
            .duration(totalTime)
            .ease(d3.easeLinear)
            .style('left', $('#barChart').width() + "px");

    }

    function resumeAnimateLine(){
        const totalTime = 60000 / globalBpm * globalCurrentData.length;

        // total length - current index
        const timeLeft = 60000 / globalBpm * (globalCurrentData.length - (globalIndex % globalCurrentData.length));

        // reset left to 0
        const line = d3.select('.animateThisLine');

        line.transition()
            .duration(0);

        line.transition()
            .duration(timeLeft / 2)
            .ease(d3.easeLinear)
            .style('left', $('#barChart').width() + "px");
    }


    function getFrequency (note) {
        var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
            octave,
            keyNumber;

        if (note.length === 3) {
            octave = note.charAt(2);
        } else {
            octave = note.charAt(1);
        }

        keyNumber = notes.indexOf(note.slice(0, -1));

        if (keyNumber < 3) {
            keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1; 
        } else {
            keyNumber = keyNumber + ((octave - 1) * 12) + 1; 
        }

        // Return frequency of note
        return 440 * Math.pow(2, (keyNumber- 49) / 12);
    };



    function playTone(){
        if(globalIndex >= globalCurrentData.length){
            globalIndex = 0;
        }

        // check if bpm changed
        if(globalBpm != globalNewBpm){
            globalBpm = globalNewBpm;

            resumeAnimateLine();
        }

        // render active bar
        renderCurrentBar(globalIndex % globalCurrentData.length);

        if (globalIndex === 0) {
            animateLine();
        }

        let note = globalCurrentData[globalIndex];

        const newFreq = getFrequency(note.split(' ')[0]);

        // calculate length
        const newLengthNum = '8n'.split('n')[0];
        const newLengthSec = Number((4 * (60 / globalBpm)) / newLengthNum);

        // trigger garbage collection
        let oscillator = null;
        let gain = null;

        oscillator = globalAudioContext.createOscillator();

        // create instance of GainNode
        gain = globalAudioContext.createGain();

        gain.gain.value = 0.4;
        oscillator.connect(gain);
        gain.connect(globalAudioContext.destination);

        let now = globalAudioContext.currentTime;

        oscillator.frequency.setValueAtTime(newFreq, now);
        oscillator.type = 'triangle';

        oscillator.start(now);
        
        const decayRate = 1.5 // seconds
        gain.gain.exponentialRampToValueAtTime(0.001, now + decayRate)

        setTimeout(()=>oscillator.stop(now), newLengthSec * 1000);

        globalIndex++;

        if(globalRepeatPlayToneFunction){
            globalPlayNoteSetTimeout = setTimeout(function(){
                playTone();
            }, newLengthSec * 1000);
        }
        else{
            // clear activeBar
            d3.selectAll('.bar').classed('activeBar', false);
        }
    }

    

    function playThreeNotes(){
        let index = 0;

        (function playOneNote(){
            let note = globalCurrentData[index];
    
            const newFreq = getFrequency(note.split(' ')[0]);
    
            // calculate length
            const newLengthNum = '8n'.split('n')[0];
            let newLengthSec = Number((4 * (60 / 330)) / newLengthNum);

            // longer sound for 3rd note
            if(index === 2){
                newLengthSec = 0.5;
            }
    
            // trigger garbage collection
            let oscillator = null;
            let gain = null;
    
            oscillator = globalAudioContext.createOscillator();
    
            // create instance of GainNode
            gain = globalAudioContext.createGain();
    
            gain.gain.value = 0.2;
            oscillator.connect(gain);
            gain.connect(globalAudioContext.destination);
    
            let now = globalAudioContext.currentTime;
    
            oscillator.frequency.setValueAtTime(newFreq, now);
            oscillator.type = 'triangle';
    
            oscillator.start(now);
            
            const decayRate = 0.9 // seconds
            gain.gain.exponentialRampToValueAtTime(0.001, now + decayRate)
    
            setTimeout(()=>oscillator.stop(now), newLengthSec * 1000);
            
            index++;
    
            if(index < 3){
                setTimeout(function(){
                    playOneNote();
                }, newLengthSec * 1000);
            }
        })();
    }


    function renderCurrentBar(index){
        $('.bar').removeClass('activeBar');
        $('.bar').eq(index).addClass('activeBar');
    }

    $('#questionButton').on('click', function(){
        $('#questionModal').css('display', 'flex');
    });

    $('#bpmButton').on('click', function(){
        $('#bpmModal').css('display', 'flex');
    });

    $('.closeQuestionModalButton').on('click', function(){
        $('#questionModal').css('display', 'none');
    });

    $('.closeBpmModalButton').on('click', function(){
        $('#bpmModal').css('display', 'none');
    })

    $('#bpmInput').on('change', function(){
        let bpmVal = $(this).val();

        if(bpmVal < 60){
            bpmVal = 60;
            $(this).val(bpmVal);
        }
        else if(bpmVal > 200){
            bpmVal = 200;
            $(this).val(bpmVal);
        }
        globalNewBpm = bpmVal;
    });

    // close modal when click outside
    const questionModal = document.querySelector('#questionModal');
    const bpmModal = document.querySelector('#bpmModal');

    window.onclick = function(event){
        if(event.target == questionModal){
            questionModal.style.display = 'none';
        }
        else if(event.target == bpmModal){
            bpmModal.style.display = 'none';
        }
    }


    renderPie();
    renderSVGForBar();


    $(window).resize(function(){
        widthOfSection = $('section').width();
        barSVGWidth = widthOfSection;

        renderSVGForBar();
        updateBars(globalCurrentData);
    });


    // render initial selection
    globalCurrentData = notesToPlay['major']['C'];
    updateBars(globalCurrentData);
    d3.select('g[data-scale="major"][data-root="C"]').select('path').attr('class', 'activePie');


    // toggle between show/hide the mobile navbar menu
    $('.hamburgerIcon').on('click', function(){
        const container = document.querySelector('.mobildLinks');
        if(container.style.display === 'block'){
            container.style.display = "none";
        }
        else{
            container.style.display = 'block';
        }
    });

});