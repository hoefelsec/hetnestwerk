var link_element_ids = {
  "#": "hero",
  "#about": "about",
  "#for_who": "for_who",
  "#partners": "partners",
  "#about_me": "about_me",
  "#contact": "contact"
}

var scroll_options = {
    "behavior": "smooth",
    "block": "nearest"
};

function link_navigate_to(section) {
  var id = link_element_ids[section];
  var element = document.getElementById(id);
  document.getElementById("mobile_menu_close").click();

  element.scrollIntoView(options=scroll_options);


}
