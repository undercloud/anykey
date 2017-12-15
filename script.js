		
CRMBusinessProcess = {}


		// new Blob(["😀"]).size

		$('#business-code-editor').keydown(function(e){
			var keyCode = e.keyCode || e.which;
		
			if(keyCode == 9){
				e.preventDefault();
				
				var start = this.selectionStart;
				var end = this.selectionEnd;

				this.value = (
					this.value.substring(0, start)
					+ "\t"
					+ this.value.substring(end)
				);

				this.selectionStart = this.selectionEnd = start + 1;
			}

			if (keyCode == 13) {
				//this.onscroll(this);
			}
		}).on('paste',function(){
			setTimeout(function(thisis){
				CRMBusinessProcess.editor.onkeypress.call(CRMBusinessProcess.editor,thisis)
			},50,this)
		}).on('click',function(){
			CRMBusinessProcess.editor.highlightLine();
		})
	
		var codeEditor = document.getElementById('business-code-editor');
		var codeView = document.getElementById('business-code-view');
		var codeLines = document.getElementById('business-code-lines');
		var codeStatus = document.getElementById('business-code-status');

		CRMBusinessProcess.editor = {
			onkeypress: function(self){
				var source = self.value;
				codeView.innerText = source;
				
				hljs.highlightBlock(codeView);
				this.buildLines(source),

				this.highlightLine();
			},
			onscroll: function(self){
				codeView.scrollTop = self.scrollTop; 
				codeView.scrollLeft = self.scrollLeft;
				codeLines.scrollTop = self.scrollTop;
			},
			buildLines: function(source){
				var lines = source.split('\n').length;

				var num = '';
				for(var i = 0;i<lines;i++){
					num += '<div class="business-code-lines-item" business-code-line="' + (i + 1) + '">' + (i + 1) +'</div>';
				}

				codeLines.innerHTML = num;
			},
			getCurrentPos: function(){
				var pos = 0;

				if (codeEditor.selectionStart) {
					pos = codeEditor.selectionStart;
				} else if (document.selection) {
					codeEditor.focus();

					var r = document.selection.createRange();
					if (r == null) {
						pos = 0;
					}

					var re = codeEditor.createTextRange(),
						rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint('EndToStart', re);

					pos = rc.text.length;
				}else{
					pos = 0;
				}
				
				var range = codeEditor.value.substr(0,pos);
				var line = range.split('\n').length;
				var col = pos - range.lastIndexOf('\n');
				
				return {
					line: line,
					col: col
				};
			},
			highlightLine: function(){
				var pos = this.getCurrentPos();
				
				codeStatus.innerText = 'Line ' + pos.line + ', Column ' + pos.col;
				
				$('#business-code-lines')
					.find('.business-code-lines-item.cursor')
					.removeClass('cursor');
					
				$('#business-code-lines')
					.find('.business-code-lines-item[business-code-line="' + pos.line + '"]')
					.addClass('cursor')
			},
			highlightErrorLine: function(line){
				$('#business-code-lines')
					.find('.business-code-lines-item.error')
					.removeClass('error');
				
				if(!line) return;
				
				$('#business-code-lines')
					.find('.business-code-lines-item[business-code-line="' + line + '"]')
					.addClass('error')
			},
		}

		var script = document.createElement('script');
		
		script.src = "code.highlight.pack.js";
		script.onload = function(){
			$('#business-code-editor').trigger('keyup');
		}

		var css = document.createElement('link');
		
		css.rel = 'stylesheet';
		css.type = 'text/css';
		css.href = 'code.highlight.pack.css';
		
		document.head.appendChild(css)
		document.head.appendChild(script);