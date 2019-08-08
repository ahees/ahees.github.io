$(function () {
	var $data = {};
	$(".error").hide();

	$("#go").on("click", function (e) {
		e.preventDefault();
		var name = $("#name").val();
		var valid_date = validateDate($("#bdate"));
		var valid_datep = validateDate($("#bdatep"));
		if (valid_date == 0) {
			$(".error-bdate").show('slow');
			$("#bdate").focus();
		} else {
			$(".error-bdate").hide('slow');
		}
		if (valid_datep == 0) {
			$(".error-bdatep").show('slow');
			$("#bdatep").focus();
		} else {
			$(".error-bdatep").hide('slow');
		}
		if (name.length <= 3) {
			$(".error-name").show('slow');
			$("#name").focus();
		} else {
			$(".error-name").hide('slow');
		}

		if (name.length > 3 && valid_date == 1 && valid_datep == 1) {

			var jsonanketa = $("#anketa").serialize();
			console.log(jsonanketa);
			$.ajax({
				url: "anketadrt.php",
				url: "https://acity.one/anketadrt.php",
				type: "POST",
				data: jsonanketa,
				success: function (res) {
					console.log(res)
					if (res == "success") {
						$(".error").hide();
						UIkit.modal("#modal").show();
						$("#anketa").trigger("reset");
						$('#go').prop('disabled',true);
						$(".other-block").hide();
					}
					if (res == "error") {
						console.log("error", res)
					}
				},
				error: function(xhr, status, error){
						var errorMessage = xhr.status + ': ' + xhr.statusText
						console.log('Error - ' + errorMessage);
				}
				
			});

		}
	});


	$("#meta").change(function (e) {
		e.preventDefault();

		if ($(this).val() == '0') {
			// console.log('meta')
			$("#metaother").show("slow", function () {
				$(this).focus()
			})
		} else {
			
			$("#metaother").val('').hide("slow")
		}

	});
	$("#prohodmattryb").change(function (e) {
		e.preventDefault();

		if ($(this).val() == '0') {
			// console.log('meta')
			$("#prohodmattrybother").show("slow", function () {
				$(this).focus()
			})
		} else {
			
			$("#prohodmattrybother").val('').hide("slow")
		}

	});
	$("#contra").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#contraother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#contraother").val('').hide("slow")
		}
	});

	$("#molz").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#molzother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#molzother").val('').hide("slow")
		}
	});

	$("#sssys").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#sssysother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#sssysother").val('').hide("slow")
		}
	});

	$("#nervsys").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#nervsysother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#nervsysother").val('').hide("slow")
		}
	});

	$("#sechwl").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#sechwlother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#nsechwlother").val('').hide("slow")
		}
	});
	$("#endsys").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#endsysother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#endsysother").val('').hide("slow")
		}
	});

	$("#trasys").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#trasysother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#trasysother").val('').hide("slow")
		}
	});
	
	$("#autohvo").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#autohvoother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#autohvoother").val('').hide("slow")
		}
	});
	
	$("#legsys").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#legsysother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#legsysother").val('').hide("slow")
		}
	});
	
	$("#onko").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#onkoother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#onkoother").val('').hide("slow")
		}
	});
	
	$("#infzah").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#infzahother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#infzahother").val('').hide("slow")
		}
	});

	$("#perenesgin").change(function (e) {
		e.preventDefault();

		if ($(this).val() == 'perenesginother') {
			// console.log('meta')
			$("#perenesginother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#perenesginother").val('').hide("slow")
		}

	});

	$("#ginz").change(function (e) {
		e.preventDefault();

		if ($(this).prop("checked")) {
			$("#ginzother").show("slow", function () {
				$(this).focus()
			})
		} else {
			$("#ginzother").val('').hide("slow")
		}
	});

	$(".p14 input[type=radio], .p16 input[type=radio], .p29 input[type=radio], .p30 input[type=radio], .p31 input[type=radio], .p32 input[type=radio]").change(function (e) {
		e.preventDefault();

		var $name = $(this).attr('name');
		var $val = $(this).val();

		if ($val == 2) {

			$("#"+$name).show("slow");
		} else {
			$("#"+$name).val('').hide("slow");
		}
	});

	$('#yesanketa').change(function(){
		if(this.checked) {
			$('#go').prop('disabled',false);
		} else {
			$('#go').prop('disabled',true);
		}
	});


});


function validateDate (parametr) {
	var value = parametr.val();
	var str = new Date(value);
	var year = str.getFullYear();
	var month = str.getMonth();
	var day = str.getDay();
	if (isNaN(year)) {
		return 0
	}
	if (year.toString().length < 4) {
		return 0
	}
	if (year < 1990 || year > 2100) {
		return 0
	}
	return 1
}