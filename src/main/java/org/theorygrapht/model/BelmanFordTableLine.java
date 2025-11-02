package org.theorygrapht.model;

import java.util.List;
import java.util.Map;

/**
 * One row of the Bellman-Ford table for the UI.
 * A single object that contains everything needed to render a row.
 * - states: vertexName -> string formatted as "(dist, pred)" with ∞/* conventions
 * - list: the processing queue at the start of the row
 * - choiceName/choiceDistance: chosen vertex and its distance
 */
public class BelmanFordTableLine {
    private Map<String, String> states; // key = vertex name, value = "(d, p)"
    private List<String> list; // processing list/queue L at the start of the row
    private String choiceName; // chosen vertex name for this row (null for final row)
    private Integer choiceDistance; // its distance at choose time

    public BelmanFordTableLine() {}

    public BelmanFordTableLine(Map<String, String> states, List<String> list, String choiceName, Integer choiceDistance) {
        this.states = states;
        this.list = list;
        this.choiceName = choiceName;
        this.choiceDistance = choiceDistance;
    }

    public Map<String, String> getStates() {
        return states;
    }

    public void setStates(Map<String, String> states) {
        this.states = states;
    }

    public List<String> getList() {
        return list;
    }

    public void setList(List<String> list) {
        this.list = list;
    }

    public String getChoiceName() {
        return choiceName;
    }

    public void setChoiceName(String choiceName) {
        this.choiceName = choiceName;
    }

    public Integer getChoiceDistance() {
        return choiceDistance;
    }

    public void setChoiceDistance(Integer choiceDistance) {
        this.choiceDistance = choiceDistance;
    }
}
