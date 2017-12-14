		
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
		}).on('paste',function(){
			setTimeout(function(thisis){
				CRMBusinessProcess.editor.onkeypress.call(CRMBusinessProcess.editor,thisis)
			},50,this)
		}).on('click',function(){
			CRMBusinessProcess.editor.highlightLine();
		})
	
		var codeView = document.getElementById('business-code-view');
		var codeLines = document.getElementById('business-code-lines');

		CRMBusinessProcess.editor = {
			onkeypress: function(self){
				var source = self.value;
				codeView.innerText = source;
				
				hljs.highlightBlock(codeView);
				codeView.prepend(this.buildLines(source));

				this.highlightLine();
			},
			onscroll: function(self){
				var top = $(self).scrollTop();
				var left = $(self).scrollLeft();

				$('#business-code-view')
					.scrollTop(top)
					.scrollLeft(left)
			},
			buildLines: function(source){
				var lines = source.split('\n').length;

				var num = '';
				for(var i = 0;i<lines;i++){
					num += '<div class="business-code-lines-item" business-code-line="' + (i + 1) + '">' + (i + 1) +'</div>';
				}
				
				var node = document.createElement('div')
				node.id = 'business-code-lines';
				node.innerHTML = num;

				return node;
			},
			getCurrentPos: function(){
				var pos = 0;
				var el = document.getElementById('business-code-editor');

				if (el.selectionStart) {
					pos = el.selectionStart;
				} else if (document.selection) {
					el.focus();

					var r = document.selection.createRange();
					if (r == null) {
						pos = 0;
					}

					var re = el.createTextRange(),
						rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint('EndToStart', re);

					pos = rc.text.length;
				}else{
					pos = 0;
				}
				
				var range = el.value.substr(0,pos);
				var line = range.split('\n').length;
				var col = pos - range.lastIndexOf('\n');
				
				return {
					line: line,
					col: col
				};
			},
			highlightLine: function(){
				var pos = this.getCurrentPos();
				
				$('#business-code-status')
					.text(
						'Line ' + pos.line + ', Column ' + pos.col
					)
				
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