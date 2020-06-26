$(document).ready(function(){

    const notesToPlay = {
        // M9
        major: {
            'C': ["C4", "E4", "G4", "B4", "D5", "B4", "G4", "E4"],
            'C#': ["C4#", "F4", "G4#", "C5", "D5", "C5", "G4#", "F4"],
            'D': ["D4", "F4#", "A4", "C5#", "E5", "C5#", "A4", "F4#"],
            'D#': ["D4#", "G4", "A4#", "D5", "F5", "D5", "A4#", "G4"],
            'E': ["E4", "G4#", "B4", "D5#", "F5#", "D5#", "B4", "G4#"],
            'F': ["F4", "A4", "C5", "E5", "G5", "E5", "C5", "A4"],
            'F#': ["F4#", "A4#", "C5#", "F5", "G5#", "F5", "C5#", "A4#"],
            'G': ["G4", "B4", "D5", "F5#", "A5", "F5#", "D5", "B4"],
            'G#': ["G4#", "C5", "D5#", "G5", "A5#", "G5", "D5#", "C5"],
            'A': ["A4", "C5#", "E5", "G5#", "B5", "G5#", "E5", "C5#"],
            'A#': ["A4#", "C5", "D5", "F5", "A5", "F5", "D5", "C5"],
            'B': ["B4", "C5#", "D5#", "F5#", "A5#", "F5#", "D5#", "C5#"],
        },
        // m7
        minor: {
            'C': ["C4", "D4#", "G4", "A4#", "G4", "D4#"],
            'C#': ["C4#", "E4", "G4#", "B4", "G4#", "E4"],
            'D': ["D4", "F4", "A4", "C5", "A4", "F4"],
            'D#': ["D4#", "F4#", "A4#", "C5#", "A4#", "F4#"],
            'E': ["E4", "G4", "B4", "D5", "B4", "G4"],
            'F': ["F4", "G4#", "C5", "D5#", "C5", "G4#"],
            'F#': ["F4#", "A4", "C5#", "E5", "C5#", "A4"],
            'G': ["G4", "A4#", "D5", "F5", "D5", "A4#"],
            'G#': ["G4#", "B4", "D5#", "F5#", "D5#", "B4"],
            'A': ["A4", "C5", "E5", "G5", "E5", "C5"],
            'A#': ["A4#", "C5#", "F5", "G5#", "F5", "C5#"],
            'B': ["B4", "D5", "F5#", "A5", "F5#", "D5"],
        }
    };

    let globalAnimateLineDuration = 0;
    let globalBpm = 120;
    let globalNewBpm = 120;
    let globalCurrentData = null;
    let globalIndex = null;

    const widthOfSection = $('section').width();
    const barSVGWidth = widthOfSection;
    const barSVGHeight = 200;

    let loopBeat;
    let synth;

    let widthOfPieDiv = $('#renderPie').width();
    console.log('widht: ', widthOfPieDiv);
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
            { label: 'A', value: 1 },
            { label: 'E', value: 1 },
            { label: 'B', value: 1 },
            { label: 'F#', value: 1 },
            { label: 'C#', value: 1 },
            { label: 'G#', value: 1 },
            { label: 'D#', value: 1 },
            { label: 'A#', value: 1 },
            { label: 'F', value: 1 },
            { label: 'C', value: 1 },
            { label: 'G', value: 1 },
            { label: 'D', value: 1 },
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
            console.log('arc clicked');
            const scale = $(this).closest('.arc').attr('data-scale');
            // console.log('scale: ', scale);

            const rootNote = $(this).closest('.arc').attr('data-root');
            // console.log('rootNote: ', rootNote);

            const newCurrentData = notesToPlay[scale][rootNote];

            const isPlaying = d3.select('#circleButton').attr('data-isPlaying');
            console.log('check isPlaying: ', isPlaying);
            
            if(newCurrentData.length === globalCurrentData.length){
                globalCurrentData = newCurrentData;

                updateBars(globalCurrentData);
            }
            else{
                globalCurrentData = newCurrentData;

                updateBars(globalCurrentData);

                // reset tone js
                Tone.Transport.cancel();

                // if alreay playing, replay tone
                console.log('isPlaying', isPlaying);
                if(isPlaying === 'true'){
                    playTone();
                }
                
                // reset animateThisLine
                d3.select('.animateThisLine')
                    .transition()
                    .duration(0)
                    .style('left', '0px')
                    .style('opacity', 0);

                // reset activeBar
                d3.selectAll('.bar').classed('activeBar', false);
            }

            if(isPlaying === 'false'){
                playQuickChord();
            }

            // take off activePie class from all arc
            d3.selectAll('.arc').select('path').attr('class', '');

            // add activePie class to change color of the active arc
            d3.select(this).select('path').attr('class', 'activePie');

        });

        d3.select('.circleGroup').on('click', function () {
            console.log('circle clicked');

            const isPlaying = d3.select('#circleButton').attr('data-isPlaying');
            console.log('isPlaying: ', isPlaying);

            if (isPlaying === 'true') {
                console.log('playing true');
                d3.select('#circleButton').attr('data-isPlaying', 'false');
                Tone.Transport.cancel();

                // reset animateThisLine
                d3.select('.animateThisLine')
                    .transition()
                    .duration(0)
                    .style('left', '0px')
                    .style('opacity', 0);

                // reset activeBar
                d3.selectAll('.bar').classed('activeBar', false);

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
                console.log('playing false');
                d3.select('#circleButton').attr('data-isPlaying', 'true');
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
            { note: 'C2', value: 1 , color: '#f6be37'},
            { note: 'D2', value: 2 , color: '#d1c12e'},
            { note: 'E2', value: 3 , color: '#95c631'},
            { note: 'F2', value: 4 , color: '#f6be37'},
            { note: 'G2', value: 5 , color: '#d1c12e'},
            { note: 'A2', value: 6 , color: '#95c631'},
            { note: 'B2', value: 7 , color: '#f6be37'},
            { note: 'C3', value: 8 , color: '#d1c12e'},
            { note: 'D3', value: 9 , color: '#95c631'},
            { note: 'E3', value: 10 , color: '#f6be37'},
            { note: 'F3', value: 11 , color: '#d1c12e'},
            { note: 'G3', value: 12 , color: '#95c631'},
            { note: 'A3', value: 13 , color: '#f6be37'},
            { note: 'B3', value: 14 , color: '#d1c12e'},
            { note: 'C4', value: 15 , color: '#95c631'},
            { note: 'D4', value: 16 , color: '#f6be37'},
            { note: 'E4', value: 17 , color: '#d1c12e'},
            { note: 'F4', value: 18 , color: '#95c631'},
            { note: 'G4', value: 19 , color: '#f6be37'},
            { note: 'A4', value: 20 , color: '#d1c12e'},
            { note: 'B4', value: 21 , color: '#95c631'},
            { note: 'C5', value: 22 , color: '#f6be37'},
            { note: 'D5', value: 23 , color: '#d1c12e'},
            { note: 'E5', value: 24 , color: '#95c631'},
            { note: 'F5', value: 25 , color: '#f6be37'},
            { note: 'G5', value: 26 , color: '#d1c12e'},
            { note: 'A5', value: 27 , color: '#95c631'},
            { note: 'B5', value: 28 , color: '#f6be37'},
        ];

        const barData = [];

        for (let i = 0; i < notesToRender.length; i++) {

            for (let j = 0; j < patterns.length; j++) {
                const patt = new RegExp(patterns[j].note);

                if (patt.test(notesToRender[i])) {
                    // barData.push(patterns[j].value);
                    barData.push({
                        index: i,
                        value: patterns[j].value,
                    });
                }
            }
        }

        console.log('barData: ', barData);

        const xScale = d3.scaleBand()
            .domain(barData.map(function(d){
                return d.index;
            }))
            .range([0, barSVGWidth]);

        console.log('svg width: ', barSVGWidth);
        console.log('xScale.bandwidth: ', xScale.bandwidth());

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
                console.log('d: ', d);
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

        // globalAnimateLineDuration = 60000 /globalBpm;
        // console.log('globalAnimateLineDuration: ', globalAnimateLineDuration);
        const totalTime = 60000 / globalBpm * globalCurrentData.length /2;
        // console.log('totalTime: ', totalTime);

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
        // console.log('totalTime: ', totalTime);

        // total length - current index - 1
        const timeLeft = 60000 / globalBpm * (globalCurrentData.length - (globalIndex % globalCurrentData.length));
        // console.log('totalTime: ', totalTime);

        // current index
        // globalIndex % globalCurrentData.length

        // reset left to 0
        const line = d3.select('.animateThisLine');

        line.transition()
            .duration(0);

        line.transition()
            .duration(timeLeft)
            .ease(d3.easeLinear)
            .style('left', $('#barChart').width() + "px");
    }


    function playTone(){
        Tone.Transport.cancel();

        //create a synth and connect it to the master output (your speakers)
        synth = new Tone.Synth({
            oscillator: {
                type: 'triangle6'
            }
        }).toMaster();

        globalIndex = 0;

        Tone.Transport.bpm.value = globalBpm;
        console.log(' bpm value: ', Tone.Transport.bpm.value);

        loopBeat = new Tone.Loop(song, '8n');
        Tone.Transport.start();
        loopBeat.start(0);

        function song(time){
            // check if bpm changed
            if(globalBpm != globalNewBpm){
                globalBpm = globalNewBpm;
                Tone.Transport.bpm.value = globalBpm;
                resumeAnimateLine();
            }
    
            const totalTime = 60000 / globalBpm * globalCurrentData.length;
            console.log('totalTime: ', totalTime);
    
            // total length - current index - 1
            const timeLeft = 60000 / globalBpm * (globalCurrentData.length - (globalIndex % globalCurrentData.length + 1));
            console.log('timeLeft: ', timeLeft);
    
            // render active bar
            // console.log('check: ', globalIndex % globalCurrentData.length);
            renderCurrentBar(globalIndex % globalCurrentData.length);
    
            // get next note's x position
            if (globalIndex % globalCurrentData.length === 0) {
                // console.log('first==============================');
                animateLine();
            }
    
            // console.log('time: ', time);
            let note = globalCurrentData[globalIndex % globalCurrentData.length];
            synth.triggerAttackRelease(note, '8n', time)
            globalIndex++;
        }
    }

    

    function playQuickChord(){
        Tone.Transport.cancel();

        //create a synth and connect it to the master output (your speakers)
        synth = new Tone.Synth({
            oscillator: {
                type: 'triangle6'
            }
        }).toMaster();

        let chordIndex = 0;

        Tone.Transport.bpm.value = 440;

        loopBeat = new Tone.Loop(songg, '8n');
        Tone.Transport.start();
        loopBeat.start(0);

        console.log('here');
        
        function songg(time){
            console.log('hi');

            let note = globalCurrentData[chordIndex % globalCurrentData.length];
            console.log('check note: ', note);
            synth.triggerAttackRelease(note, '8n', time)
            chordIndex++;
            if(chordIndex === 3){
                Tone.Transport.cancel();
            }
        }
    }

    

    // function playToneOriginal() {

    //     Tone.Transport.cancel();

    //     //create a synth and connect it to the master output (your speakers)
    //     const synth = new Tone.Synth().toMaster();

    //     globalIndex = 0;

    //     Tone.Transport.bpm.value = globalBpm;
    //     console.log(' bpm value: ', Tone.Transport.bpm.value);

    //     //repeated event every 8th note
    //     Tone.Transport.scheduleRepeat(function (time) {
    //         //do something with the time
    //         repeat(time);
    //     }, "4n");

    //     function repeat(time) {

    //         if (globalIndex % globalCurrentData.length === 0) {
    //             console.log('first==============================');
    //             animateLine();
    //         }

    //         console.log('time: ', time);
    //         let note = globalCurrentData[globalIndex % globalCurrentData.length];
    //         synth.triggerAttackRelease(note, '8n', time)
    //         globalIndex++;
    //     }

    //     Tone.Transport.start();

    // };

    function renderCurrentBar(index){
        // console.log('index: ', index);
        // console.log('dom el: ', $('.bar')[0]);
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
        console.log('bpmVal: ', bpmVal);
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

    // render initial selection
    globalCurrentData = notesToPlay['major']['C'];
    updateBars(globalCurrentData);
    d3.select('g[data-scale="major"][data-root="C"]').select('path').attr('class', 'activePie');



});